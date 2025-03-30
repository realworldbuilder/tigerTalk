import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { formatTimestamp } from '@/lib/utils';
import { useMutation } from 'convex/react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ConstructionReportDetails from './ConstructionReportDetails';

export default function RecordingDesktop({
  note,
  actionItems,
}: {
  note: Doc<'notes'>;
  actionItems: Doc<'actionItems'>[];
}) {
  const {
    generatingActionItems,
    generatingTitle,
    summary,
    transcription,
    title,
    _creationTime,
    isConstructionReport,
  } = note;
  const [originalIsOpen, setOriginalIsOpen] = useState<boolean>(true);
  const [showReport, setShowReport] = useState<boolean>(false);

  const mutateActionItems = useMutation(api.notes.removeActionItem);

  function removeActionItem(actionId: any) {
    // Trigger a mutation to remove the item from the list
    mutateActionItems({ id: actionId });
  }

  // Determine if we should show the construction report option
  const hasConstructionReport = isConstructionReport === true;

  return (
    <div className="hidden md:block">
      <div className="max-width mt-5 flex items-center justify-between">
        <div />
        <h1
          className={`leading text-center text-xl font-medium leading-[114.3%] tracking-[-0.75px] text-dark md:text-2xl lg:text-3xl ${
            generatingTitle && 'animate-pulse'
          }`}
        >
          {generatingTitle ? 'Generating Title...' : title ?? 'Untitled Note'}
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-sm md:text-base lg:text-lg opacity-80">
            {formatTimestamp(Number(_creationTime))}
          </p>
        </div>
      </div>
      <div className="mt-[18px] grid h-fit w-full grid-cols-2 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex w-full items-center justify-center gap-[50px] border-r lg:gap-[70px]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setOriginalIsOpen(true);
                setShowReport(false);
              }}
              className={`text-base md:text-lg leading-[114.3%] tracking-[-0.6px] text-dark ${
                originalIsOpen && !showReport ? 'opacity-100' : 'opacity-40'
              } transition-all duration-300`}
            >
              Transcript
            </button>
            <div
              onClick={() => {
                if (!showReport) {
                  setOriginalIsOpen(!originalIsOpen);
                } else {
                  setShowReport(false);
                  setOriginalIsOpen(false);
                }
              }}
              className="flex h-[20px] w-[36px] cursor-pointer items-center rounded-full bg-dark px-[1px]"
            >
              <div
                className={`h-[18px] w-4 rounded-[50%] bg-light ${
                  originalIsOpen || showReport ? 'translate-x-0' : 'translate-x-[18px]'
                } transition-all duration-300`}
              />
            </div>
            <button
              onClick={() => {
                setOriginalIsOpen(false);
                setShowReport(false);
              }}
              className={`text-base md:text-lg leading-[114.3%] tracking-[-0.6px] text-dark ${
                !originalIsOpen && !showReport ? 'opacity-100' : 'opacity-40'
              } transition-all duration-300`}
            >
              Summary
            </button>
            
            {hasConstructionReport && (
              <>
                <div className="mx-2">|</div>
                <button
                  onClick={() => {
                    setShowReport(true);
                    setOriginalIsOpen(false);
                  }}
                  className={`text-base md:text-lg leading-[114.3%] tracking-[-0.6px] text-dark ${
                    showReport ? 'opacity-100' : 'opacity-40'
                  } transition-all duration-300`}
                >
                  Construction Report
                </button>
              </>
            )}
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-base md:text-lg lg:text-xl leading-[114.3%] tracking-[-0.75px] text-dark">
            Action Items
          </h1>
        </div>
      </div>
      <div className="grid h-full w-full grid-cols-2 px-4 md:px-6 lg:px-8">
        <div className="relative min-h-[70vh] w-full border-r px-4 py-3 text-justify text-sm md:text-base lg:text-lg font-[300] leading-[114.3%] tracking-[-0.6px]">
          {transcription ? (
            showReport ? (
              <ConstructionReportDetails note={note} />
            ) : (
              <div className="">{originalIsOpen ? transcription : summary}</div>
            )
          ) : (
            // Loading state for transcript
            <ul className="animate-pulse space-y-3">
              <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
              <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
              <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
              <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
              <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
            </ul>
          )}
        </div>
        <div className="relative mx-auto mt-[27px] w-full max-w-[900px] px-5 md:mt-[45px]">
          {generatingActionItems
            ? [0, 1, 3].map((item: any, idx: number) => (
                <div
                  className="animate-pulse border-[#00000033] py-1 md:border-t-[1px] md:py-2"
                  key={idx}
                >
                  <div className="flex w-full justify-center">
                    <div className="group w-full items-center rounded p-2 text-base md:text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100">
                      <div className="flex items-center">
                        <input
                          disabled
                          type="checkbox"
                          checked={false}
                          className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
                        />
                        <label className="h-5 w-full rounded-full bg-gray-200" />
                      </div>
                      <div className="flex justify-between md:mt-2">
                        <p className="ml-9 text-xs md:text-sm lg:text-base font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60">
                          {new Date(Number(_creationTime)).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : actionItems?.map((item: any, idx: number) => (
                <div
                  className="border-[#00000033] py-1 md:border-t-[1px] md:py-2"
                  key={idx}
                >
                  <div className="flex w-full justify-center">
                    <div className="group w-full items-center rounded p-2 text-base md:text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100">
                      <div className="flex items-center">
                        <input
                          onChange={(e) => {
                            if (e.target.checked) {
                              removeActionItem(item._id);
                              toast.success('1 task completed.');
                            }
                          }}
                          type="checkbox"
                          checked={false}
                          className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
                        />
                        <label className="">{item?.task}</label>
                      </div>
                      <div className="flex justify-between md:mt-2">
                        <p className="ml-9 text-xs md:text-sm lg:text-base font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60">
                          {new Date(Number(_creationTime)).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-center">
            <Link
              className="rounded-[7px] bg-dark px-5 py-3 text-base md:text-lg leading-[79%] tracking-[-0.75px] text-light lg:px-[37px]"
              style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
              href="/dashboard/action-items"
            >
              View All Action Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
