import React from 'react';

interface AnalyzerTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AnalyzerTabs: React.FC<AnalyzerTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'analyzer', label: 'File Analyzer' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="mb-8 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AnalyzerTabs;
