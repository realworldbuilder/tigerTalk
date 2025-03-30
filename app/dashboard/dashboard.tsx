'use client';

import RecordedfileItemCard from '@/components/pages/dashboard/RecordedfileItemCard';
import Pagination from '@/components/ui/Pagination';
import { api } from '@/convex/_generated/api';
import { usePreloadedQueryWithAuth } from '@/lib/hooks';
import { Preloaded, useAction } from 'convex/react';
import { FunctionReturnType } from 'convex/server';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardHomePage({
  preloadedNotes,
}: {
  preloadedNotes: Preloaded<typeof api.notes.getNotes>;
}) {
  const allNotes = usePreloadedQueryWithAuth(preloadedNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [relevantNotes, setRelevantNotes] =
    useState<FunctionReturnType<typeof api.notes.getNotes>>();

  const performMyAction = useAction(api.together.similarNotes);

  const handleSearch = async (e: any) => {
    e.preventDefault();

    console.log({ searchQuery });
    if (searchQuery === '') {
      setRelevantNotes(undefined);
    } else {
      const scores = await performMyAction({ searchQuery: searchQuery });
      const scoreMap: Map<string, number> = new Map();
      for (const s of scores) {
        scoreMap.set(s.id, s.score);
      }
      const filteredResults = allNotes.filter(
        (note) => (scoreMap.get(note._id) ?? 0) > 0.6,
      );
      setRelevantNotes(filteredResults);
    }
  };

  const finalNotes = relevantNotes ?? allNotes;

  return (
    <div suppressHydrationWarning={true} className="min-h-screen w-full bg-white px-5 py-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome back!</h1>
          <p className="mt-2 text-gray-600">Here's a list of all your notes!</p>
        </div>
        
        {/* search bar */}
        <div className="mx-auto mb-6 flex rounded-md border border-gray-300 bg-white px-3 py-2">
          <Image
            src="/icons/search.svg"
            width={20}
            height={20}
            alt="search"
            className="mr-2 h-5 w-5 text-gray-400"
          />
          <form onSubmit={handleSearch} className="w-full">
            <input
              type="text"
              placeholder="Search notes..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              className="w-full bg-transparent text-gray-700 outline-none"
            />
          </form>
        </div>
        
        {/* table header */}
        <div className="mb-2 flex border-b border-gray-200 py-2 text-sm font-medium text-gray-500">
          <div className="flex-1 px-4">Title</div>
          <div className="w-32 px-4 text-right md:w-48">Date</div>
        </div>
        
        {/* notes list */}
        <div className="rounded-md border border-gray-200">
          {finalNotes && finalNotes.length > 0 ? (
            finalNotes.map((item, index) => (
              <RecordedfileItemCard {...item} key={index} />
            ))
          ) : (
            <div className="flex h-32 items-center justify-center text-gray-500">
              <p>You currently have no recordings.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <Pagination />
        
        {/* Record button */}
        <div className="mt-6 flex justify-end">
          <Link
            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            href="/record"
          >
            Record a New Note
          </Link>
        </div>
      </div>
    </div>
  );
}
