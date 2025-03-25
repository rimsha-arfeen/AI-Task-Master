import React from 'react';
import { AnalysisResult, ScoreCategory } from '@/types/analysis';
import ScoreOverview from './ScoreOverview';
import CodePreview from './CodePreview';
import Recommendations from './Recommendations';

interface ResultsContainerProps {
  analysisResults: AnalysisResult | null;
  isLoading: boolean;
}

const ResultsContainer: React.FC<ResultsContainerProps> = ({ analysisResults, isLoading }) => {
  const getCategoryColor = (name: string): { bg: string, text: string } => {
    switch (name) {
      case 'Naming':
        return { bg: 'bg-blue-100', text: 'text-primary' };
      case 'Modularity':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'Comments':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'Formatting':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'Reusability':
        return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
      case 'Best Practices':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const getCategories = (): ScoreCategory[] => {
    if (!analysisResults) return [];

    return [
      {
        name: 'Naming',
        value: analysisResults.breakdown.naming,
        maxValue: 10,
        ...getCategoryColor('Naming')
      },
      {
        name: 'Modularity',
        value: analysisResults.breakdown.modularity,
        maxValue: 20,
        ...getCategoryColor('Modularity')
      },
      {
        name: 'Comments',
        value: analysisResults.breakdown.comments,
        maxValue: 20,
        ...getCategoryColor('Comments')
      },
      {
        name: 'Formatting',
        value: analysisResults.breakdown.formatting,
        maxValue: 15,
        ...getCategoryColor('Formatting')
      },
      {
        name: 'Reusability',
        value: analysisResults.breakdown.reusability,
        maxValue: 15,
        ...getCategoryColor('Reusability')
      },
      {
        name: 'Best Practices',
        value: analysisResults.breakdown.best_practices,
        maxValue: 20,
        ...getCategoryColor('Best Practices')
      }
    ];
  };

  return (
    <div className="lg:col-span-2">
      {!analysisResults && !isLoading ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No code analyzed yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Upload and analyze a file to see quality metrics and recommendations
          </p>
        </div>
      ) : (
        <div className={`${isLoading ? 'opacity-60' : ''} space-y-6`}>
          {analysisResults && (
            <>
              <ScoreOverview 
                overallScore={analysisResults.overall_score} 
                categories={getCategories()} 
              />
              
              <CodePreview 
                fileName={analysisResults.file_name} 
                code={analysisResults.file_content} 
              />
              
              <Recommendations 
                recommendations={analysisResults.recommendations} 
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsContainer;
