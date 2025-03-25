import React from 'react';

interface RecommendationsProps {
  recommendations: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  // These are example descriptions that would normally come from the backend
  const descriptionMap: Record<string, string> = {
    "Use snake_case for function names in Python (should be 'calculate_total').": 
      "Python style guides recommend using snake_case for function names to maintain consistency with standard libraries.",
    "Avoid using 'sum' as a variable name—it's a built-in.": 
      "Reusing built-in names can lead to unexpected behavior. Consider using 'total' or 'result' instead.",
    "Add a docstring to explain the purpose of the function.": 
      "Docstrings provide clarity on function purpose, parameters, and return values, improving code maintainability.",
    "Function 'calculateTotal' in app.py is too long—consider refactoring.": 
      "Functions with more than 20-30 lines can be difficult to understand and maintain. Break them into smaller, more focused functions.",
    "Use camelCase for variable 'Total_Amount'.": 
      "In JavaScript, the convention is to use camelCase for variable names to maintain consistent style across the codebase."
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
        
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="ri-error-warning-line text-xl text-amber-500"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">{recommendation}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{descriptionMap[recommendation] || "Improve your code by following this recommendation."}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Recommendations;
