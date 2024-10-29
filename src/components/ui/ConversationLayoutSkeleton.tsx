import React from 'react';

const ConversationSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto p-5 animate-pulse">
      {/* Header info skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      {/* Conversation items */}
      <div className="space-y-5">
        {[1].map((item) => (
          <div key={item} className="border rounded-lg p-4 shadow-sm">
            {/* Prompt and download button row */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-200 rounded" />
            </div>

            {/* Results */}
            <div className="space-y-3">
              {[1, 2].map((result) => (
                <div key={result} className="flex flex-col gap-2">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationSkeleton;