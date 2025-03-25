import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4.5H6.5C5.39543 4.5 4.5 5.39543 4.5 6.5V17.5C4.5 18.6046 5.39543 19.5 6.5 19.5H17.5C18.6046 19.5 19.5 18.6046 19.5 17.5V15M19.5 9V4.5M19.5 4.5H15M19.5 4.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="ml-2 text-xl font-semibold text-gray-900">Carbon Crunch</h1>
        </div>
        <div>
          <span className="text-sm text-gray-500">Code Quality Analyzer</span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
