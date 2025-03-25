import React from 'react';
import { ScoreCategory } from '@/types/analysis';

interface ScoreOverviewProps {
  overallScore: number;
  categories: ScoreCategory[];
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({ overallScore, categories }) => {
  // Calculate the stroke dashoffset for the progress circle
  const calculateCircleProgress = (score: number) => {
    const radius = 56;
    const circumference = radius * 2 * Math.PI;
    return circumference - (score / 100) * circumference;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>
        
        <div className="flex flex-col md:flex-row items-center md:space-x-6">
          {/* Overall Score */}
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle 
                  className="text-gray-200" 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="56" 
                  cx="64" 
                  cy="64"
                ></circle>
                <circle 
                  className="text-primary" 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="56" 
                  cx="64" 
                  cy="64" 
                  strokeDasharray="351.8"
                  strokeDashoffset={calculateCircleProgress(overallScore)}
                ></circle>
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{overallScore}</span>
              </div>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">Overall Score</span>
          </div>
          
          {/* Score Breakdown */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${category.bgColor}`}>
                  <span className={`text-lg font-semibold ${category.textColor}`}>{category.value}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-gray-700">{category.name} ({category.maxValue})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreOverview;
