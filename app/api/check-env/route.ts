import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function GET() {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
  
  try {
    const envVarsMissing = await client.query(api.utils.envVarsMissing, {});
    
    return Response.json({ 
      envVarsMissing: envVarsMissing || null,
      status: envVarsMissing ? 'Missing environment variables' : 'All environment variables set'
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
} 