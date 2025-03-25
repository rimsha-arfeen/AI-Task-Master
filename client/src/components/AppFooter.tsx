import React from 'react';

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-white mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Carbon Crunch. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
