import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FileIcon, Trash2 } from 'lucide-react';

const RecordedfileItemCard = ({
  title,
  count,
  _creationTime,
  _id,
}: {
  title?: string;
  count: number;
  _creationTime: number;
  _id: any;
}) => {
  const deleteNote = useMutation(api.notes.removeNote);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format for mobile display (shorter)
  const formatMobileDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link
      href={`/recording/${_id}`}
      className="flex items-center justify-between border-b border-gray-200 px-2 py-2 sm:px-4 sm:py-3 hover:bg-gray-50"
    >
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-100">
          <FileIcon 
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" 
            stroke="currentColor"
            fill="none"
          />
        </div>
        <div className="overflow-hidden max-w-[180px] sm:max-w-none">
          <h3 className="truncate text-xs sm:text-sm md:text-base font-medium text-gray-800">
            {title || "Untitled Note"}
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <span className="text-2xs sm:text-xs md:text-sm text-gray-500">
          {isMobile ? formatMobileDate(_creationTime) : formatDate(_creationTime)}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteNote({ id: _id });
          }}
          className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          aria-label="Delete note"
        >
          <Trash2 
            className="h-4 w-4 sm:h-5 sm:w-5" 
            stroke="currentColor"
            fill="none"
          />
        </button>
      </div>
    </Link>
  );
};

export default RecordedfileItemCard;
