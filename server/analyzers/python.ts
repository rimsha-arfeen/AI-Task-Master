import {
  createBaseAnalysisResult,
  calculateOverallScore,
  limitRecommendations,
  checkIndentation,
  checkNamingConventions,
  checkComments,
  checkModularity,
  checkReusability,
  checkBestPractices
} from "./common";
import { AnalysisResult } from "@shared/schema";

export async function analyzePython(code: string, fileName: string): Promise<AnalysisResult> {
  // Create base result
  const result = createBaseAnalysisResult(fileName, code, "py");

  // Check naming conventions
  const namingResults = checkNamingConventions(code, "python");
  result.breakdown.naming = namingResults.score;
  const namingRecommendations = namingResults.recommendations;

  // Check formatting
  const formattingResults = checkIndentation(code);
  result.breakdown.formatting = formattingResults.score;
  const formattingRecommendations = formattingResults.recommendation 
    ? [formattingResults.recommendation] 
    : [];

  // Check comments and documentation
  const commentsResults = checkComments(code, "python");
  result.breakdown.comments = commentsResults.score;
  const commentsRecommendations = commentsResults.recommendations;

  // Check modularity
  const modularityResults = checkModularity(code, "python");
  result.breakdown.modularity = modularityResults.score;
  const modularityRecommendations = modularityResults.recommendations;

  // Check reusability and DRY
  const reusabilityResults = checkReusability(code);
  result.breakdown.reusability = reusabilityResults.score;
  const reusabilityRecommendations = reusabilityResults.recommendations;

  // Check best practices
  const bestPracticesResults = checkBestPractices(code, "python");
  result.breakdown.best_practices = bestPracticesResults.score;
  const bestPracticesRecommendations = bestPracticesResults.recommendations;

  // Combine and limit recommendations
  const allRecommendations = [
    ...namingRecommendations,
    ...formattingRecommendations,
    ...commentsRecommendations,
    ...modularityRecommendations,
    ...reusabilityRecommendations,
    ...bestPracticesRecommendations
  ];

  result.recommendations = limitRecommendations(allRecommendations, 5);

  // Calculate overall score
  result.overall_score = calculateOverallScore(result);

  return result;
}
