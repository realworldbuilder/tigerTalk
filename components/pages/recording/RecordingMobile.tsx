import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import toast, { Toaster } from 'react-hot-toast';
import { Doc } from '@/convex/_generated/dataModel';
import ConstructionReportDetails from './ConstructionReportDetails';
import { XCircle } from 'lucide-react';

export default function RecordingMobile({
  note,
  actionItems,
}: {
  note: Doc<'notes'>;
  actionItems: Doc<'actionItems'>[];
}) {
  const { transcription, title, _creationTime, isConstructionReport } = note;
  const [transcriptOpen, setTranscriptOpen] = useState<boolean>(true);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [actionItemOpen, setActionItemOpen] = useState<boolean>(false);

  const mutateActionItems = useMutation(api.notes.removeActionItem);

  function removeActionItem(actionId: any) {
    // Trigger a mutation to remove the item from the list
    mutateActionItems({ id: actionId });
  }

  return (
    <div className="md:hidden">
      <div className="max-width my-5 flex items-center justify-center">
        <h1 className="leading text-center text-xl font-medium leading-[114.3%] tracking-[-0.75px] text-dark md:text-2xl">
          {title ?? 'Untitled Note'}
        </h1>
      </div>
      <div className="grid w-full grid-cols-3">
        <button
          onClick={() => (
            setTranscriptOpen(!transcriptOpen),
            setActionItemOpen(false),
            setReportOpen(false)
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
            setReportOpen(!reportOpen)
          )}
          className={`py-[12px] text-sm sm:text-base leading-[114.3%] tracking-[-0.425px] ${
            reportOpen ? 'action-btn-active' : 'action-btn'
          }`}
        >
          Report
        </button>
        <button
          onClick={() => (
            setTranscriptOpen(false),
            setActionItemOpen(!actionItemOpen),
            setReportOpen(false)
          )}
          className={`py-[12px] text-sm sm:text-base leading-[114.3%] tracking-[-0.425px] ${
            actionItemOpen ? 'action-btn-active' : 'action-btn'
          }`}
        >
          Action Items
        </button>
      </div>
      <div className="w-full">
        {transcriptOpen && (
          <div className="relative mt-2 min-h-[70vh] w-full px-4 py-3 text-justify text-sm sm:text-base font-light">
            <div className="">{transcription}</div>
          </div>
        )}
        {reportOpen && (
          <ConstructionReportDetails note={note} />
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
                    <div className="group w-full items-center rounded py-2 text-sm sm:text-base font-[300] text-dark transition-colors duration-300 hover:bg-orange-50">
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
                      <div className="flex justify-between md:mt-2">
                        <p className="ml-9 text-xs sm:text-sm font-[300] leading-[249%] tracking-[-0.6px] text-orange-500 opacity-80">
                          {new Date(Number(_creationTime)).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-10 flex items-center justify-center">
                <Link
                  className="rounded-[7px] bg-orange-500 px-5 py-3 text-sm sm:text-base leading-[79%] tracking-[-0.75px] text-white"
                  style={{
                    boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.15)',
                  }}
                  href="/dashboard/action-items"
                >
                  View All Action Items
                </Link>
              </div>
            </div>{' '}
          </div>
        )}
        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
    </div>
  );
}
