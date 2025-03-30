import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
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
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </Link>
  );
};

export default RecordedfileItemCard;
