import OpenAI from 'openai';
import {
  internalAction,
  internalMutation,
  internalQuery,
} from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import { z } from 'zod';
import { actionWithUser } from './utils';
import Instructor from '@instructor-ai/instructor';

const togetherApiKey = process.env.TOGETHER_API_KEY ?? 'undefined';

// Together client for LLM extraction
const togetherai = new OpenAI({
  apiKey: togetherApiKey,
  baseURL: 'https://api.together.xyz/v1',
});

// Instructor for returning structured JSON
const client = Instructor({
  client: togetherai,
  mode: 'JSON_SCHEMA',
});

// Updated schema to include construction report fields
const NoteSchema = z.object({
  title: z
    .string()
    .describe('Short descriptive title of what the voice message is about'),
  summary: z
    .string()
    .describe(
      'A short summary in the first person point of view of the person recording the voice message',
    )
    .max(500),
  actionItems: z
    .array(z.string())
    .describe(
      'A list of action items from the voice note, short and to the point. Make sure all action item lists are fully resolved if they are nested',
    ),
  // Construction report fields
  isConstructionReport: z
    .boolean()
    .describe('True if this appears to be a construction daily report, false otherwise'),
  manpower: z
    .string()
    .optional()
    .describe('Information about workers, staffing, or labor on the construction site'),
  weather: z
    .string()
    .optional()
    .describe('Information about weather conditions affecting the construction site'),
  delays: z
    .string()
    .optional()
    .describe('Information about delays, setbacks or schedule issues on the project'),
  openIssues: z
    .string()
    .optional()
    .describe('Information about unresolved problems, concerns or issues requiring attention'),
  equipment: z
    .string()
    .optional()
    .describe('Information about equipment used, equipment issues, or equipment needs'),
});

export const chat = internalAction({
  args: {
    id: v.id('notes'),
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const { transcript } = args;
    
    // Clean and format the transcript to prevent validation errors
    const cleanedTranscript = transcript
      .replace(/[\r\n]+/g, ' ') // Replace multiple newlines with space
      .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
      .trim();                 // Trim extra whitespace
    
    console.log('Processing transcript with length:', cleanedTranscript.length);
    
    // If transcript is too long, truncate it
    const maxLength = 16000;  // Maximum context length for most models
    const finalTranscript = cleanedTranscript.length > maxLength 
      ? cleanedTranscript.substring(0, maxLength) + "..." 
      : cleanedTranscript;

    try {
      // Try using the regular OpenAI approach without Instructor
      console.log('Attempting to generate summary with standard approach');
      
      try {
        const response = await togetherai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `The following is a transcript of a voice message. Extract a title, summary, action items, and if it appears to be a construction daily report, extract construction-specific information.
              
              The response should be formatted in JSON following this exact structure:
              {
                "title": "Short descriptive title of what the voice message is about",
                "summary": "A short summary in the first person point of view of the person recording the voice message (maximum 500 characters)",
                "actionItems": ["Action item 1", "Action item 2", ...],
                "isConstructionReport": boolean (true/false),
                "manpower": "Information about workers, staffing, or labor (only if construction report)",
                "weather": "Information about weather conditions (only if construction report)",
                "delays": "Information about delays or schedule issues (only if construction report)",
                "openIssues": "Information about unresolved problems or issues (only if construction report)",
                "equipment": "Information about equipment used or needed (only if construction report)"
              }
              
              If the voice message is NOT a construction report, only include title, summary, actionItems, and set isConstructionReport to false.
              If it IS a construction report, include all fields and set values appropriately based on the transcript.
              Use "Not mentioned" for construction fields that aren't explicitly mentioned in the transcript.
              Make sure to only include valid JSON without markdown formatting or any other text.`
            },
            { role: 'user', content: finalTranscript }
          ],
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          temperature: 0.3,
          max_tokens: 1000,
        });
        
        // Parse the JSON response
        const responseContent = response.choices[0]?.message.content?.trim() || '';
        let extractedData;
        
        try {
          // Find JSON portion in the response
          const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : responseContent;
          extractedData = JSON.parse(jsonStr);
          
          // Validate the required fields
          if (!extractedData.title || !extractedData.summary || !Array.isArray(extractedData.actionItems)) {
            throw new Error('Missing required fields in response');
          }
          
          // Save the extracted data
          await ctx.runMutation(internal.together.saveSummary, {
            id: args.id,
            summary: extractedData.summary,
            actionItems: extractedData.actionItems,
            title: extractedData.title,
            isConstructionReport: extractedData.isConstructionReport || false,
            manpower: extractedData.manpower || "Not mentioned",
            weather: extractedData.weather || "Not mentioned",
            delays: extractedData.delays || "Not mentioned",
            openIssues: extractedData.openIssues || "Not mentioned",
            equipment: extractedData.equipment || "Not mentioned",
          });
          
          return; // Exit if successful
        } catch (jsonError) {
          console.error('Error parsing response as JSON:', jsonError, 'Response:', responseContent);
          throw jsonError;
        }
      } catch (err) {
        console.error('Error with standard approach:', err);
        
        // Try with GPT-3.5-Turbo as fallback (known to work well with JSON responses)
        console.log('Falling back to GPT-3.5-Turbo model');
        const response = await togetherai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `The following is a transcript of a voice message. Extract a title, summary, action items, and if it appears to be a construction daily report, extract construction-specific information.
              
              The response should be formatted in JSON following this exact structure:
              {
                "title": "Short descriptive title of what the voice message is about",
                "summary": "A short summary in the first person point of view of the person recording the voice message (maximum 500 characters)",
                "actionItems": ["Action item 1", "Action item 2", ...],
                "isConstructionReport": boolean (true/false),
                "manpower": "Information about workers, staffing, or labor (only if construction report)",
                "weather": "Information about weather conditions (only if construction report)",
                "delays": "Information about delays or schedule issues (only if construction report)",
                "openIssues": "Information about unresolved problems or issues (only if construction report)",
                "equipment": "Information about equipment used or needed (only if construction report)"
              }
              
              If the voice message is NOT a construction report, only include title, summary, actionItems, and set isConstructionReport to false.
              If it IS a construction report, include all fields and set values appropriately based on the transcript.
              Use "Not mentioned" for construction fields that aren't explicitly mentioned in the transcript.
              Make sure to only include valid JSON without markdown formatting or any other text.`
            },
            { role: 'user', content: finalTranscript }
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.3,
          max_tokens: 1000,
        });
        
        // Parse the JSON response
        const responseContent = response.choices[0]?.message.content?.trim() || '';
        let extractedData;
        
        try {
          // Find JSON portion in the response
          const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : responseContent;
          extractedData = JSON.parse(jsonStr);
          
          // Validate the required fields
          if (!extractedData.title || !extractedData.summary || !Array.isArray(extractedData.actionItems)) {
            throw new Error('Missing required fields in response');
          }
        } catch (jsonError) {
          console.error('Error parsing GPT response as JSON:', jsonError, 'Response:', responseContent);
          throw jsonError;
        }
        
        await ctx.runMutation(internal.together.saveSummary, {
          id: args.id,
          summary: extractedData.summary,
          actionItems: extractedData.actionItems,
          title: extractedData.title,
          isConstructionReport: extractedData.isConstructionReport || false,
          manpower: extractedData.manpower || "Not mentioned",
          weather: extractedData.weather || "Not mentioned",
          delays: extractedData.delays || "Not mentioned",
          openIssues: extractedData.openIssues || "Not mentioned",
          equipment: extractedData.equipment || "Not mentioned",
        });
      }
    } catch (e: any) {
      console.error('All approaches failed:', e);
      await ctx.runMutation(internal.together.saveSummary, {
        id: args.id,
        summary: 'Summary failed to generate. Please try again or contact support if this persists.',
        actionItems: [],
        title: 'Voice Note ' + new Date().toLocaleDateString(),
        isConstructionReport: false,
        manpower: "Not mentioned",
        weather: "Not mentioned",
        delays: "Not mentioned",
        openIssues: "Not mentioned",
        equipment: "Not mentioned",
      });
    }
  },
});

export const getTranscript = internalQuery({
  args: {
    id: v.id('notes'),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const note = await ctx.db.get(id);
    return note?.transcription;
  },
});

export const saveSummary = internalMutation({
  args: {
    id: v.id('notes'),
    summary: v.string(),
    title: v.string(),
    actionItems: v.array(v.string()),
    isConstructionReport: v.boolean(),
    manpower: v.string(),
    weather: v.string(),
    delays: v.string(),
    openIssues: v.string(),
    equipment: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, summary, actionItems, title, isConstructionReport, manpower, weather, delays, openIssues, equipment } = args;
    await ctx.db.patch(id, {
      summary: summary,
      title: title,
      generatingTitle: false,
      isConstructionReport: isConstructionReport,
      manpower: manpower,
      weather: weather,
      delays: delays,
      openIssues: openIssues,
      equipment: equipment,
    });

    let note = await ctx.db.get(id);

    if (!note) {
      console.error(`Couldn't find note ${id}`);
      return;
    }
    for (let actionItem of actionItems) {
      await ctx.db.insert('actionItems', {
        task: actionItem,
        noteId: id,
        userId: note.userId,
      });
    }

    await ctx.db.patch(id, {
      generatingActionItems: false,
    });
  },
});

export type SearchResult = {
  id: string;
  score: number;
};

export const similarNotes = actionWithUser({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args): Promise<SearchResult[]> => {
    const getEmbedding = await togetherai.embeddings.create({
      input: [args.searchQuery.replace('/n', ' ')],
      model: 'togethercomputer/m2-bert-80M-32k-retrieval',
    });
    const embedding = getEmbedding.data[0].embedding;

    // 2. Then search for similar notes
    const results = await ctx.vectorSearch('notes', 'by_embedding', {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq('userId', ctx.userId), // Only search my notes.
    });

    console.log({ results });

    return results.map((r) => ({
      id: r._id,
      score: r._score,
    }));
  },
});

export const embed = internalAction({
  args: {
    id: v.id('notes'),
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const getEmbedding = await togetherai.embeddings.create({
      input: [args.transcript.replace('/n', ' ')],
      model: 'togethercomputer/m2-bert-80M-32k-retrieval',
    });
    const embedding = getEmbedding.data[0].embedding;

    await ctx.runMutation(internal.together.saveEmbedding, {
      id: args.id,
      embedding,
    });
  },
});

export const saveEmbedding = internalMutation({
  args: {
    id: v.id('notes'),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const { id, embedding } = args;
    await ctx.db.patch(id, {
      embedding: embedding,
    });
  },
});
