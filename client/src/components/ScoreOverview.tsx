import React from 'react';
import { AnalysisResponse, CATEGORIES } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreOverviewProps {
  results: AnalysisResponse;
}

export default function ScoreOverview({ results }: ScoreOverviewProps) {
  const { overall_score, breakdown } = results;
  
  // Calculate stroke-dashoffset for circular progress
  const calculateCircleProgress = (score: number) => {
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const scorePercentage = score / 100;
    return circumference - (circumference * scorePercentage);
  };

  return (
    <Card>
      <CardContent className="p-6">
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
                  strokeDasharray={2 * Math.PI * 56} 
                  strokeDashoffset={calculateCircleProgress(overall_score)}
                  transform="rotate(-90 64 64)"
                ></circle>
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{overall_score}</span>
              </div>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">Overall Score</span>
          </div>
          
          {/* Score Breakdown */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(breakdown).map(([category, score]) => {
              const categoryKey = category as keyof typeof breakdown;
              const categoryInfo = CATEGORIES[categoryKey];
              
              return (
                <div className="text-center" key={category}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${categoryInfo.bgColor}`}>
                    <span className={`text-lg font-semibold ${categoryInfo.color}`}>{score}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-gray-700">
                    {categoryInfo.name} ({categoryInfo.maxScore})
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
