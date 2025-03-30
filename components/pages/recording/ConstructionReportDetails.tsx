import { Doc } from '@/convex/_generated/dataModel';

export default function ConstructionReportDetails({
  note,
}: {
  note: Doc<'notes'>;
}) {
  const { manpower, weather, delays, openIssues, equipment, summary } = note;

  // Only show sections that have content
  const hasManpower = manpower && manpower !== "Not mentioned";
  const hasWeather = weather && weather !== "Not mentioned";
  const hasDelays = delays && delays !== "Not mentioned";
  const hasOpenIssues = openIssues && openIssues !== "Not mentioned";
  const hasEquipment = equipment && equipment !== "Not mentioned";

  return (
    <div className="relative mt-2 min-h-[70vh] w-full px-4 py-3 text-sm sm:text-base font-light">
      <div className="space-y-4">
        {/* Summary section at the top */}
        <div className="text-justify mb-6">
          {summary}
        </div>
        
        {/* Construction report details */}
        {(hasManpower || hasWeather || hasDelays || hasOpenIssues || hasEquipment) && (
          <h2 className="text-lg font-medium">Construction Report Details</h2>
        )}
        
        {hasManpower && (
          <div className="rounded-lg border border-gray-200 p-3">
            <h3 className="mb-1 font-medium">Manpower</h3>
            <p>{manpower}</p>
          </div>
        )}
        
        {hasWeather && (
          <div className="rounded-lg border border-gray-200 p-3">
            <h3 className="mb-1 font-medium">Weather</h3>
            <p>{weather}</p>
          </div>
        )}
        
        {hasDelays && (
          <div className="rounded-lg border border-gray-200 p-3">
            <h3 className="mb-1 font-medium">Delays</h3>
            <p>{delays}</p>
          </div>
        )}
        
        {hasOpenIssues && (
          <div className="rounded-lg border border-gray-200 p-3">
            <h3 className="mb-1 font-medium">Open Issues</h3>
            <p>{openIssues}</p>
          </div>
        )}
        
        {hasEquipment && (
          <div className="rounded-lg border border-gray-200 p-3">
            <h3 className="mb-1 font-medium">Equipment</h3>
            <p>{equipment}</p>
          </div>
        )}
        
        {!hasManpower && !hasWeather && !hasDelays && !hasOpenIssues && !hasEquipment && (
          <p className="text-gray-500">No construction report details available.</p>
        )}
      </div>
    </div>
  );
} 