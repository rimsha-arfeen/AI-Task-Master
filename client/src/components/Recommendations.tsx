import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  // Helper function to generate simple explanations based on the recommendation text
  const getExplanation = (recommendation: string): string => {
    // This is a simple pattern-matching approach to generate explanations
    if (recommendation.includes('snake_case')) {
      return 'Python style guides recommend using snake_case for function names to maintain consistency with standard libraries.';
    }
    if (recommendation.includes('built-in')) {
      return 'Reusing built-in names can lead to unexpected behavior. Consider using specific variable names instead.';
    }
    if (recommendation.includes('docstring')) {
      return 'Docstrings provide clarity on function purpose, parameters, and return values, improving code maintainability.';
    }
    if (recommendation.includes('too long')) {
      return 'Long functions are harder to understand and test. Consider breaking it into smaller, focused functions.';
    }
    if (recommendation.includes('camelCase')) {
      return 'Maintaining consistent naming conventions improves code readability and helps follow language standards.';
    }
    if (recommendation.includes('nested')) {
      return 'Deeply nested code reduces readability and increases complexity. Consider extracting functions or components.';
    }
    
    // Default explanation
    return 'Following this recommendation will improve your code quality and maintainability.';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
        
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">{recommendation}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{getExplanation(recommendation)}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
