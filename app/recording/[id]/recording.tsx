'use client';

import RecordingDesktop from '@/components/pages/recording/RecordingDesktop';
import RecordingMobile from '@/components/pages/recording/RecordingMobile';
import { api } from '@/convex/_generated/api';
import { usePreloadedQueryWithAuth } from '@/lib/hooks';
import { Preloaded } from 'convex/react';

export default function RecordingPage({
  preloadedNote,
}: {
  preloadedNote: Preloaded<typeof api.notes.getNote>;
}) {
  const currentNote = usePreloadedQueryWithAuth(preloadedNote);

  return (
    <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
      {currentNote.note === null ? (
        <div className="mt-10 text-center">
          <h1 className="text-4xl">Note not found</h1>
        </div>
      ) : (
        <>
          <RecordingDesktop {...currentNote} />
          <RecordingMobile {...currentNote} />
        </>
      )}
    </div>
  );
}
