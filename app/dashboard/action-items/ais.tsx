'use client';

import { api } from '@/convex/_generated/api';
import { usePreloadedQueryWithAuth } from '@/lib/hooks';
import { Preloaded, useMutation } from 'convex/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { XCircle } from 'lucide-react';

export default function ActionItemsPage({
  preloadedItems,
}: {
  preloadedItems: Preloaded<typeof api.notes.getActionItems>;
}) {
  const actionItems = usePreloadedQueryWithAuth(preloadedItems);
  const mutateActionItems = useMutation(api.notes.removeActionItem);

  function removeActionItem(actionId: any) {
    // Trigger a mutation to remove the item from the list
    mutateActionItems({ id: actionId });
  }

  return (
    <div className="min-h-[100vh]">
      <div className="flex-col items-center justify-center text-center md:flex">
        <div className="w-full pb-1 pt-4">
          <h1 className="text-center text-xl font-medium text-dark md:text-2xl lg:text-3xl">
            Action Items
          </h1>
        </div>
        <h3 className="mt-3 text-sm text-gray-600 md:text-base lg:text-lg">
          {actionItems?.length ? actionItems?.length : 0} tasks
        </h3>
      </div>
      <div className="mx-auto mt-[27px] w-full max-w-[900px] px-5 md:mt-[45px]">
        {actionItems?.map((item, idx) => (
          <div
            className="border-[#00000033] py-1 md:border-t-[1px] md:py-2"
            key={idx}
          >
            <div className="flex w-full justify-center">
              <div className="group w-full items-center rounded p-2 text-base md:text-lg font-[300] text-dark transition-colors duration-300 hover:bg-orange-50">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      removeActionItem(item._id);
                      toast.success('1 task completed.');
                    }}
                    className="mr-4 h-6 w-6 flex items-center justify-center rounded-full border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                  <label className="text-orange-700">{item?.task}</label>
                </div>
                <div className="flex justify-between gap-3 md:mt-2">
                  <p className="ml-9 text-xs md:text-sm lg:text-base font-[300] leading-[249%] tracking-[-0.6px] text-orange-500 opacity-80">
                    {new Date(item?._creationTime).toLocaleDateString()}
                  </p>
                  <p className="truncate text-xs md:text-sm lg:text-base font-[300] leading-[249%] tracking-[-0.6px] text-orange-500 opacity-80">
                    From: {item?.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {actionItems?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-7">
              <p className="text-center text-base md:text-lg lg:text-xl text-dark">
                You currently have no action items.
              </p>
              <Link
                className="rounded-[7px] bg-orange-500 px-5 py-3 text-base md:text-lg leading-[79%] tracking-[-0.75px] text-white"
                style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)' }}
                href="/record"
              >
                Record your first voice note
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
