import { AnalysisResponse } from "@shared/schema";

interface JavaScriptAnalysisMetrics {
  namingScore: number;
  modularityScore: number;
  commentsScore: number;
  formattingScore: number;
  reusabilityScore: number;
  bestPracticesScore: number;
  recommendations: string[];
}

export async function analyzeJavascriptCode(code: string): Promise<AnalysisResponse> {
  // Initialize metrics
  const metrics: JavaScriptAnalysisMetrics = {
    namingScore: 0,
    modularityScore: 0,
    commentsScore: 0,
    formattingScore: 0,
    reusabilityScore: 0,
    bestPracticesScore: 0,
    recommendations: []
  };

  // 1. Analyze naming conventions (10 points)
  analyzeCamelCaseConsistency(code, metrics);
  analyzeDescriptiveNames(code, metrics);

  // 2. Analyze function length and modularity (20 points)
  analyzeFunctionLength(code, metrics);
  analyzeNestedBlocks(code, metrics);

  // 3. Analyze comments and documentation (20 points)
  analyzeCommentRatio(code, metrics);
  analyzeJSDocComments(code, metrics);
  
  // 4. Analyze formatting/indentation (15 points)
  analyzeConsistentSpacing(code, metrics);
  analyzeIndentation(code, metrics);
  
  // 5. Analyze reusability and DRY (15 points)
  analyzeDuplicateCode(code, metrics);
  analyzeComponentStructure(code, metrics);
  
  // 6. Analyze best practices in web dev (20 points)
  analyzeAccessibility(code, metrics);
  analyzePerformancePatterns(code, metrics);
  analyzeReactBestPractices(code, metrics);

  // Cap scores at their maximums
  metrics.namingScore = Math.min(10, metrics.namingScore);
  metrics.modularityScore = Math.min(20, metrics.modularityScore);
  metrics.commentsScore = Math.min(20, metrics.commentsScore);
  metrics.formattingScore = Math.min(15, metrics.formattingScore);
  metrics.reusabilityScore = Math.min(15, metrics.reusabilityScore);
  metrics.bestPracticesScore = Math.min(20, metrics.bestPracticesScore);

  // Calculate overall score
  const overallScore = Math.round(
    metrics.namingScore +
    metrics.modularityScore +
    metrics.commentsScore +
    metrics.formattingScore +
    metrics.reusabilityScore +
    metrics.bestPracticesScore
  );

  // Return formatted response
  return {
    overall_score: overallScore,
    breakdown: {
      naming: metrics.namingScore,
      modularity: metrics.modularityScore,
      comments: metrics.commentsScore,
      formatting: metrics.formattingScore,
      reusability: metrics.reusabilityScore,
      best_practices: metrics.bestPracticesScore
    },
    recommendations: metrics.recommendations.slice(0, 5) // Limit to top 5 recommendations
  };
}

// ---- Analysis helper functions ----

function analyzeCamelCaseConsistency(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for variables and functions using consistent camelCase
  const nonCamelCaseRegex = /const|let|var|function\s+([A-Z][a-z0-9]*[A-Z_]|[a-z]+_[a-z]+)\s*=?/g;
  const pascalCaseComponentNameRegex = /function\s+([a-z][A-Za-z0-9]*Component|\w+_\w+)\s*\(/g;
  
  const nonCamelCaseMatches = [...code.matchAll(nonCamelCaseRegex)];
  const pascalCaseComponentMatches = [...code.matchAll(pascalCaseComponentNameRegex)];
  
  // Award points for consistent naming
  const totalMatches = code.match(/const|let|var|function\s+\w+/g)?.length || 0;
  if (totalMatches > 0) {
    const incorrectMatches = nonCamelCaseMatches.length + pascalCaseComponentMatches.length;
    const correctRatio = 1 - Math.min(incorrectMatches / totalMatches, 1);
    metrics.namingScore += Math.round(5 * correctRatio);
  } else {
    metrics.namingScore += 5; // If no matches, assume good naming
  }
  
  // Add recommendations for inconsistent naming
  if (nonCamelCaseMatches.length > 0) {
    const examples = nonCamelCaseMatches.slice(0, 2).map(match => match[1]);
    metrics.recommendations.push(`Use camelCase for variables and function names (e.g., ${examples.join(', ')}).`);
  }
  
  if (pascalCaseComponentMatches.length > 0) {
    metrics.recommendations.push(`Use PascalCase for React component names.`);
  }
}

function analyzeDescriptiveNames(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for short, non-descriptive variable and function names
  const shortNameRegex = /const|let|var|function\s+([a-z_]{1,2})\s*=?/g;
  const matches = [...code.matchAll(shortNameRegex)];
  
  // Award points for descriptive naming
  metrics.namingScore += Math.min(5, 5 - matches.length);
  
  // Add recommendation for non-descriptive names
  if (matches.length > 0) {
    metrics.recommendations.push(`Use descriptive variable names instead of short abbreviations like "${matches[0][1]}".`);
  }
}

function analyzeFunctionLength(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Extract functions and count lines
  const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{([^}]*)}/gs;
  const arrowFunctionRegex = /const\s+\w+\s*=\s*(\([^)]*\)|[^=]+)\s*=>\s*{([^}]*)}/gs;
  
  const functions = [
    ...code.matchAll(functionRegex),
    ...code.matchAll(arrowFunctionRegex)
  ];
  
  if (functions.length === 0) {
    metrics.modularityScore += 10; // If no functions, award partial points
    return;
  }
  
  let longFunctions = 0;
  
  for (const func of functions) {
    const body = func[1] || func[2];
    const lines = body.split('\n').filter(line => line.trim().length > 0).length;
    
    if (lines > 15) {
      longFunctions++;
    }
  }
  
  // Award points based on function length
  metrics.modularityScore += Math.min(10, 10 - (longFunctions * 2));
  
  // Add recommendation for long functions
  if (longFunctions > 0) {
    metrics.recommendations.push(`Break down functions that are longer than 15 lines for better readability and maintainability.`);
  }
}

function analyzeNestedBlocks(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for deeply nested blocks (more than 3 levels)
  const deeplyNestedPattern = /{\s*{\s*{\s*{\s*[^{}]*}\s*}\s*}\s*}/g;
  const matches = code.match(deeplyNestedPattern) || [];
  
  // Award points based on nesting levels
  metrics.modularityScore += Math.min(10, 10 - (matches.length * 2));
  
  // Add recommendation for deep nesting
  if (matches.length > 0) {
    metrics.recommendations.push(`Avoid deeply nested code blocks (more than 3 levels deep).`);
  }
}

function analyzeCommentRatio(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Count lines of code and comment lines
  const lines = code.split('\n');
  const codeLines = lines.filter(line => line.trim().length > 0);
  const commentLines = lines.filter(line => 
    line.trim().startsWith('//') || 
    line.trim().startsWith('/*') || 
    line.trim().startsWith('*') || 
    line.trim().startsWith('*/')
  );
  
  if (codeLines.length === 0) {
    metrics.commentsScore += 5;
    return;
  }
  
  // Calculate comment ratio
  const ratio = commentLines.length / codeLines.length;
  
  // Award points based on comment ratio (ideal: ~20%)
  if (ratio >= 0.15 && ratio <= 0.4) {
    metrics.commentsScore += 10;
  } else if (ratio > 0 && ratio < 0.15) {
    metrics.commentsScore += 5;
  } else if (ratio > 0.4) {
    metrics.commentsScore += 7; // Too many comments can also be an issue
  }
  
  // Add recommendation for comment ratio
  if (ratio < 0.1) {
    metrics.recommendations.push(`Add more comments to explain complex logic or non-obvious code decisions.`);
  }
}

function analyzeJSDocComments(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for JSDoc comments for functions
  const functionRegex = /function\s+\w+\s*\(/g;
  const jsdocRegex = /\/\*\*[\s\S]*?\*\/\s*function\s+\w+\s*\(/g;
  
  const allFunctions = code.match(functionRegex) || [];
  const documentedFunctions = code.match(jsdocRegex) || [];
  
  if (allFunctions.length === 0) {
    metrics.commentsScore += 10;
    return;
  }
  
  // Award points based on documented functions ratio
  const ratio = documentedFunctions.length / allFunctions.length;
  metrics.commentsScore += Math.min(10, Math.floor(ratio * 10));
  
  // Add recommendation for JSDoc comments
  if (ratio < 0.5 && allFunctions.length > 1) {
    metrics.recommendations.push(`Add JSDoc comments to document function parameters and return values.`);
  }
}

function analyzeConsistentSpacing(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for inconsistent spacing around operators
  const inconsistentSpacing = [
    /[a-zA-Z0-9]\+[a-zA-Z0-9]/g,    // No space around +
    /[a-zA-Z0-9]-[a-zA-Z0-9]/g,     // No space around -
    /[a-zA-Z0-9]\*[a-zA-Z0-9]/g,    // No space around *
    /[a-zA-Z0-9]\/[a-zA-Z0-9]/g,    // No space around /
    /[a-zA-Z0-9]=[a-zA-Z0-9]/g,     // No space around =
    /[a-zA-Z0-9]===[a-zA-Z0-9]/g,   // No space around ===
    /[a-zA-Z0-9]!==[a-zA-Z0-9]/g,   // No space around !==
  ];
  
  let inconsistentCount = 0;
  for (const pattern of inconsistentSpacing) {
    inconsistentCount += (code.match(pattern) || []).length;
  }
  
  // Award points based on consistent spacing
  metrics.formattingScore += Math.min(7, 7 - Math.min(inconsistentCount, 7));
  
  // Add recommendation for inconsistent spacing
  if (inconsistentCount > 3) {
    metrics.recommendations.push(`Use consistent spacing around operators and after commas.`);
  }
}

function analyzeIndentation(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for consistent indentation
  const lines = code.split('\n');
  let mixedIndentation = false;
  let inconsistentIndentation = 0;
  
  const spaceIndent = lines.filter(line => line.startsWith('  ')).length;
  const tabIndent = lines.filter(line => line.startsWith('\t')).length;
  
  // Check for mixed tabs and spaces
  if (spaceIndent > 0 && tabIndent > 0) {
    mixedIndentation = true;
  }
  
  // Check for inconsistent indentation levels
  const previousIndent: number[] = [];
  let bracketBalance = 0;
  
  for (let line of lines) {
    line = line.trimRight();
    if (line.trim().length === 0) continue;
    
    const leadingSpaces = line.length - line.trimLeft().length;
    const openBrackets = (line.match(/{/g) || []).length;
    const closeBrackets = (line.match(/}/g) || []).length;
    
    if (previousIndent.length > 0) {
      const expectedIndent = previousIndent[previousIndent.length - 1];
      if (bracketBalance > 0 && leadingSpaces !== expectedIndent + 2 && line.trim()[0] !== '}') {
        inconsistentIndentation++;
      }
    }
    
    bracketBalance += openBrackets - closeBrackets;
    
    if (openBrackets > 0) {
      previousIndent.push(leadingSpaces);
    }
    
    if (closeBrackets > 0) {
      for (let i = 0; i < closeBrackets; i++) {
        previousIndent.pop();
      }
    }
  }
  
  // Award points based on indentation consistency
  if (mixedIndentation) {
    metrics.formattingScore += 4;
  } else {
    metrics.formattingScore += 8;
  }
  
  // Deduct for inconsistent indentation
  metrics.formattingScore -= Math.min(metrics.formattingScore, inconsistentIndentation);
  
  // Add recommendations for indentation issues
  if (mixedIndentation) {
    metrics.recommendations.push(`Use either spaces or tabs for indentation, but not both.`);
  }
  
  if (inconsistentIndentation > 3) {
    metrics.recommendations.push(`Maintain consistent indentation levels throughout your code.`);
  }
}

function analyzeDuplicateCode(code: string, metrics: JavaScriptAnalysisMetrics) {
  // A simplified way to detect similar code patterns
  // Find repeated function calls with similar patterns
  const lines = code.split('\n').map(line => line.trim());
  const patternMap = new Map<string, number>();
  
  // Create a simplified pattern for each line
  for (const line of lines) {
    if (line.length < 10) continue;
    
    // Create a simplified pattern (replacing literals with placeholders)
    const pattern = line
      .replace(/['"][^'"]*['"]/g, 'STR')          // Replace strings
      .replace(/\b\d+\b/g, 'NUM')                // Replace numbers
      .replace(/\b[a-zA-Z_]\w*\b/g, match => {   // Keep function calls and keywords
        if (['if', 'else', 'for', 'while', 'return', 'const', 'let', 'var', 'function'].includes(match)) {
          return match;
        }
        return 'ID';
      });
    
    patternMap.set(pattern, (patternMap.get(pattern) || 0) + 1);
  }
  
  // Count patterns that appear multiple times
  let duplicates = 0;
  for (const [_, count] of patternMap.entries()) {
    if (count > 2) {
      duplicates++;
    }
  }
  
  // Award points based on code reuse
  metrics.reusabilityScore += Math.min(8, 8 - Math.min(duplicates, 8));
  
  // Add recommendation for duplicate code
  if (duplicates > 2) {
    metrics.recommendations.push(`Extract repeated code patterns into reusable functions.`);
  }
}

function analyzeComponentStructure(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for React component patterns
  const hasReactImport = code.includes('import React') || code.includes('from "react"');
  
  if (hasReactImport) {
    // Check for good component organization
    const exportedComponentCount = (code.match(/export\s+(default\s+)?((function|class|const)\s+\w+)/g) || []).length;
    const propDestructuring = (code.match(/({[^{}]*})\s*=\s*props/g) || []).length;
    const propTypesCheck = code.includes('PropTypes');
    
    // Award points based on component organization
    metrics.reusabilityScore += Math.min(7, exportedComponentCount * 2);
    
    if (propDestructuring > 0) {
      metrics.reusabilityScore += 2;
    }
    
    if (propTypesCheck) {
      metrics.reusabilityScore += 3;
    }
    
    // Add recommendation for component organization
    if (exportedComponentCount === 0) {
      metrics.recommendations.push(`Create reusable components with appropriate exports.`);
    }
    
    if (!propTypesCheck && exportedComponentCount > 0) {
      metrics.recommendations.push(`Use PropTypes or TypeScript interfaces to define component props.`);
    }
  } else {
    // Non-React code: check for general modularity
    const exportedFunctionsCount = (code.match(/export\s+(default\s+)?function\s+\w+/g) || []).length;
    metrics.reusabilityScore += Math.min(7, exportedFunctionsCount * 2);
  }
}

function analyzeAccessibility(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for accessibility patterns in React
  const imgWithoutAlt = (code.match(/<img[^>]*(?!alt=)[^>]*>/g) || []).length;
  const ariaAttributes = (code.match(/aria-\w+=/g) || []).length;
  const buttonWithoutType = (code.match(/<button[^>]*(?!type=)[^>]*>/g) || []).length;
  const semanticElements = (code.match(/<(header|nav|main|footer|article|section|aside)/g) || []).length;
  
  // Award points based on accessibility patterns
  metrics.bestPracticesScore += Math.min(5, 5 - imgWithoutAlt);
  metrics.bestPracticesScore += Math.min(3, ariaAttributes);
  metrics.bestPracticesScore += Math.min(2, 2 - buttonWithoutType);
  metrics.bestPracticesScore += Math.min(3, semanticElements);
  
  // Add recommendations for accessibility issues
  if (imgWithoutAlt > 0) {
    metrics.recommendations.push(`Add alt attributes to all <img> elements for better accessibility.`);
  }
  
  if (buttonWithoutType > 0) {
    metrics.recommendations.push(`Specify the type attribute for all <button> elements.`);
  }
  
  if (ariaAttributes === 0 && semanticElements === 0) {
    metrics.recommendations.push(`Improve accessibility by using semantic HTML elements and ARIA attributes.`);
  }
}

function analyzePerformancePatterns(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for performance patterns
  const inlineEventHandlers = (code.match(/on\w+=\{.*\}/g) || []).length;
  const useEffect = (code.match(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{/g) || []).length;
  const useCallback = (code.match(/useCallback\s*\(\s*\(\s*\)\s*=>\s*{/g) || []).length;
  const useMemo = (code.match(/useMemo\s*\(\s*\(\s*\)\s*=>\s*{/g) || []).length;
  
  // Award points based on performance patterns
  metrics.bestPracticesScore += Math.min(3, 3 - Math.min(inlineEventHandlers, 3));
  metrics.bestPracticesScore += Math.min(4, useEffect + useCallback + useMemo);
  
  // Add recommendations for performance issues
  if (inlineEventHandlers > 2) {
    metrics.recommendations.push(`Extract inline event handlers to separate functions to prevent unnecessary re-renders.`);
  }
  
  if (useEffect > 0 && useEffect === useCallback) {
    metrics.recommendations.push(`Use memoization techniques like useCallback and useMemo to optimize performance.`);
  }
}

function analyzeReactBestPractices(code: string, metrics: JavaScriptAnalysisMetrics) {
  // Check for React best practices
  const hasReactImport = code.includes('import React') || code.includes('from "react"');
  
  if (hasReactImport) {
    const stateInFunctionalComponent = (code.match(/useState\s*\(/g) || []).length;
    const destructuredImports = (code.match(/import\s+{[^{}]*}\s+from/g) || []).length;
    const fragmentUsage = (code.match(/<>|<Fragment/g) || []).length;
    
    // Award points based on React best practices
    metrics.bestPracticesScore += Math.min(3, stateInFunctionalComponent > 0 ? 3 : 0);
    metrics.bestPracticesScore += Math.min(2, destructuredImports);
    metrics.bestPracticesScore += Math.min(2, fragmentUsage);
    
    // Add recommendations for React best practices
    if (stateInFunctionalComponent === 0 && code.includes('class ') && code.includes('extends ')) {
      metrics.recommendations.push(`Consider using functional components with hooks instead of class components.`);
    }
    
    if (fragmentUsage === 0 && code.includes('<div>') && code.includes('</div>')) {
      metrics.recommendations.push(`Use React Fragments (<></> or <Fragment>) to avoid unnecessary div wrappers.`);
    }
  }
}
