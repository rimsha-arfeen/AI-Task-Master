import React from 'react';
import { AnalysisResponse } from '@/lib/types';
import ScoreOverview from './ScoreOverview';
import CodePreview from './CodePreview';
import Recommendations from './Recommendations';
import { AlertCircle } from 'lucide-react';

interface ResultsContainerProps {
  results: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  fileContent: string | null;
  fileName: string | undefined;
}

export default function ResultsContainer({
  results,
  isLoading,
  error,
  fileContent,
  fileName
}: ResultsContainerProps) {
  // Show placeholder when no results are available
  if (!results && !isLoading && !error) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No code analyzed yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Upload and analyze a file to see quality metrics and recommendations
          </p>
        </div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden p-8">
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Analysis Error</h3>
          <p className="mt-2 text-sm text-red-500 text-center">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden p-8 text-center">
          <div className="flex justify-center">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Analyzing your code...</h3>
          <p className="mt-2 text-sm text-gray-500">
            We're examining the code quality of your file. This may take a moment.
          </p>
        </div>
      </div>
    );
  }

  // Show results
  return (
    <div className="lg:col-span-2 space-y-6">
      {results && (
        <>
          <ScoreOverview results={results} />
          <CodePreview code={fileContent || ''} fileName={fileName || 'code.txt'} />
          <Recommendations recommendations={results.recommendations} />
        </>
      )}
    </div>
  );
}
