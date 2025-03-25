import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import FileUploader from '@/components/FileUploader';
import ResultsContainer from '@/components/ResultsContainer';
import { AnalysisResponse } from '@/lib/types';

export default function Analyzer() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'settings'>('analyzer');
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (uploadedFile: File | null) => {
    setFile(uploadedFile);
    setAnalysisResults(null);
    setError(null);
    
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(uploadedFile);
    } else {
      setFileContent(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !fileContent) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analyzer' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('analyzer')}
              aria-current={activeTab === 'analyzer' ? 'page' : undefined}
            >
              File Analyzer
            </button>
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
              aria-current={activeTab === 'history' ? 'page' : undefined}
            >
              History
            </button>
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('settings')}
              aria-current={activeTab === 'settings' ? 'page' : undefined}
            >
              Settings
            </button>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FileUploader 
            onFileUpload={handleFileUpload}
            onAnalyze={handleAnalyze}
            file={file}
            isAnalyzing={isAnalyzing}
          />
          
          <ResultsContainer 
            results={analysisResults}
            isLoading={isAnalyzing}
            error={error}
            fileContent={fileContent}
            fileName={file?.name}
          />
        </div>
      </main>
      
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Carbon Crunch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
