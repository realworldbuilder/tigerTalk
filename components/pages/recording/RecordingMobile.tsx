import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import toast, { Toaster } from 'react-hot-toast';
import { Doc } from '@/convex/_generated/dataModel';
import ConstructionReportDetails from './ConstructionReportDetails';

export default function RecordingMobile({
  note,
  actionItems,
}: {
  note: Doc<'notes'>;
  actionItems: Doc<'actionItems'>[];
}) {
  const { summary, transcription, title, _creationTime, isConstructionReport } = note;
  const [transcriptOpen, setTranscriptOpen] = useState<boolean>(true);
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false);
  const [actionItemOpen, setActionItemOpen] = useState<boolean>(false);
  const [constructionReportOpen, setConstructionReportOpen] = useState<boolean>(false);

  const mutateActionItems = useMutation(api.notes.removeActionItem);

  function removeActionItem(actionId: any) {
    // Trigger a mutation to remove the item from the list
    mutateActionItems({ id: actionId });
  }

  // Determine if we should show the construction report tab
  const showConstructionReport = isConstructionReport === true;

  return (
    <div className="md:hidden">
      <div className="max-width my-5 flex items-center justify-center">
        <h1 className="leading text-center text-xl font-medium leading-[114.3%] tracking-[-0.75px] text-dark md:text-2xl">
          {title ?? 'Untitled Note'}
        </h1>
      </div>
      <div className={`grid w-full ${showConstructionReport ? 'grid-cols-4' : 'grid-cols-3'}`}>
        <button
          onClick={() => (
            setTranscriptOpen(!transcriptOpen),
            setActionItemOpen(false),
            setSummaryOpen(false),
            setConstructionReportOpen(false)
          )}
          className={`py-[12px] text-sm sm:text-base leading-[114.3%] tracking-[-0.425px] ${
            transcriptOpen ? 'action-btn-active' : 'action-btn'
          }`}
        >
          Transcript
        </button>
        <button
          onClick={() => (
            setTranscriptOpen(false),
            setActionItemOpen(false),
            setSummaryOpen(!summaryOpen),
            setConstructionReportOpen(false)
          )}
          className={`py-[12px] text-sm sm:text-base leading-[114.3%] tracking-[-0.425px] ${
            summaryOpen ? 'action-btn-active' : 'action-btn'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => (
            setTranscriptOpen(false),
            setActionItemOpen(!actionItemOpen),
            setSummaryOpen(false),
            setConstructionReportOpen(false)
          )}
          className={`py-[12px] text-sm sm:text-base leading-[114.3%] tracking-[-0.425px] ${
            actionItemOpen ? 'action-btn-active' : 'action-btn'
          }`}
        >
          Action Items
        </button>
        {showConstructionReport && (
          <button
            onClick={() => (
              setTranscriptOpen(false),
              setActionItemOpen(false),
              setSummaryOpen(false),
              setConstructionReportOpen(!constructionReportOpen)
            )}
            className={`py-[12px] text-sm sm:text-base leading-[114.3%] tracking-[-0.425px] ${
              constructionReportOpen ? 'action-btn-active' : 'action-btn'
            }`}
          >
            Report
          </button>
        )}
      </div>
      <div className="w-full">
        {transcriptOpen && (
          <div className="relative mt-2 min-h-[70vh] w-full px-4 py-3 text-justify text-sm sm:text-base font-light">
            <div className="">{transcription}</div>
          </div>
        )}
        {summaryOpen && (
          <div className="relative mt-2 min-h-[70vh] w-full px-4 py-3 text-justify text-sm sm:text-base font-light">
            {summary}
          </div>
        )}
        {actionItemOpen && (
          <div className="relative min-h-[70vh] w-full px-4 py-3">
            {' '}
            <div className="relative mx-auto mt-[27px] w-full max-w-[900px] px-5 md:mt-[45px]">
              {actionItems?.map((item: any, idx: number) => (
                <div
                  className="border-[#00000033] py-1 md:border-t-[1px] md:py-2"
                  key={idx}
                >
                  <div className="flex w-full justify-center">
                    <div className="group w-full items-center rounded py-2 text-sm sm:text-base font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100">
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
                        <p className="ml-9 text-xs sm:text-sm font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60">
                          {new Date(Number(_creationTime)).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-10 flex items-center justify-center">
                <Link
                  className="rounded-[7px] bg-dark px-5 py-3 text-sm sm:text-base leading-[79%] tracking-[-0.75px] text-light"
                  style={{
                    boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                  }}
                  href="/dashboard/action-items"
                >
                  View All Action Items
                </Link>
              </div>
            </div>{' '}
          </div>
        )}
        {constructionReportOpen && showConstructionReport && (
          <ConstructionReportDetails note={note} />
        )}
        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
    </div>
  );
}
