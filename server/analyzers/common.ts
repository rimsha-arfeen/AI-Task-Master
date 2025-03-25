import { AnalysisResult } from "@shared/schema";

/**
 * Creates a basic analysis result object structure
 */
export function createBaseAnalysisResult(
  fileName: string,
  fileContent: string,
  fileType: "js" | "jsx" | "py"
): AnalysisResult {
  return {
    overall_score: 0,
    breakdown: {
      naming: 0,
      modularity: 0,
      comments: 0,
      formatting: 0,
      reusability: 0,
      best_practices: 0,
    },
    recommendations: [],
    file_name: fileName,
    file_size: Buffer.from(fileContent).length,
    file_content: fileContent,
    file_type: fileType,
  };
}

/**
 * Calculate the overall score based on the breakdown scores
 */
export function calculateOverallScore(result: AnalysisResult): number {
  const { naming, modularity, comments, formatting, reusability, best_practices } = result.breakdown;
  const total = naming + modularity + comments + formatting + reusability + best_practices;
  const maxTotal = 10 + 20 + 20 + 15 + 15 + 20; // Max possible scores
  return Math.round((total / maxTotal) * 100);
}

/**
 * Limit the number of recommendations to the specified count
 */
export function limitRecommendations(recommendations: string[], count = 5): string[] {
  return recommendations.slice(0, count);
}

/**
 * Check if indentation is consistent
 */
export function checkIndentation(code: string): {
  score: number;
  inconsistent: boolean;
  recommendation?: string;
} {
  const lines = code.split("\n");
  let prevIndent = 0;
  let indentChar: string | null = null;
  let indentSize = 0;
  let inconsistent = false;

  for (const line of lines) {
    if (line.trim() === "") continue;

    const indent = line.length - line.trimLeft().length;
    
    // Determine indentation character and size on first indented line
    if (indent > 0 && indentChar === null) {
      indentChar = line[0] === " " ? " " : "\t";
      indentSize = indent;
    }

    // Check if indentation is a multiple of the indentation size
    if (indent > 0 && indentSize > 0 && indent % indentSize !== 0) {
      inconsistent = true;
      break;
    }

    prevIndent = indent;
  }

  return {
    score: inconsistent ? 5 : 15,
    inconsistent,
    recommendation: inconsistent 
      ? "Use consistent indentation throughout your code"
      : undefined
  };
}

/**
 * Check if variable/function naming follows conventions
 */
export function checkNamingConventions(
  code: string,
  language: "javascript" | "python"
): {
  score: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let score = 10; // Start with perfect score and deduct

  if (language === "javascript") {
    // Check for camelCase for variables and functions in JavaScript
    const jsVarRegex = /\b(const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\b/g;
    const jsFuncRegex = /\bfunction\s+([A-Za-z_][A-Za-z0-9_]*)\b/g;
    
    let match;
    while ((match = jsVarRegex.exec(code)) !== null) {
      const varName = match[2];
      if (!/^[a-z][A-Za-z0-9]*$/.test(varName) && !/^[A-Z_]+$/.test(varName)) {
        recommendations.push(`Use camelCase for variable '${varName}'`);
        score -= 2;
      }
    }
    
    while ((match = jsFuncRegex.exec(code)) !== null) {
      const funcName = match[1];
      if (!/^[a-z][A-Za-z0-9]*$/.test(funcName)) {
        recommendations.push(`Use camelCase for function '${funcName}'`);
        score -= 2;
      }
    }
  } else if (language === "python") {
    // Check for snake_case for variables and functions in Python
    const pyFuncRegex = /\bdef\s+([A-Za-z_][A-Za-z0-9_]*)\b/g;
    const pyVarRegex = /\b([A-Za-z_][A-Za-z0-9_]*)\s*=/g;
    
    let match;
    while ((match = pyFuncRegex.exec(code)) !== null) {
      const funcName = match[1];
      if (!/^[a-z_][a-z0-9_]*$/.test(funcName)) {
        recommendations.push(`Use snake_case for function names in Python (should be '${funcName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')}')}`);
        score -= 2;
      }
    }
    
    while ((match = pyVarRegex.exec(code)) !== null) {
      const varName = match[1];
      if (!/^[a-z_][a-z0-9_]*$/.test(varName) && !/^[A-Z_]+$/.test(varName)) {
        recommendations.push(`Use snake_case for variable names in Python`);
        score -= 2;
      }
    }
  }

  return {
    score: Math.max(0, score),
    recommendations
  };
}

/**
 * Check comments and documentation
 */
export function checkComments(
  code: string,
  language: "javascript" | "python"
): {
  score: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let score = 0;
  
  const codeLines = code.split('\n').filter(line => line.trim() !== '');
  
  // Check for presence of any comments
  const jsCommentRegex = /\/\/|\/\*|\*\//;
  const pyCommentRegex = /#|"""/;
  
  let commentCount = 0;
  
  if (language === "javascript") {
    commentCount = code.split('\n').filter(line => jsCommentRegex.test(line)).length;
  } else {
    commentCount = code.split('\n').filter(line => pyCommentRegex.test(line)).length;
  }
  
  // Calculate comment ratio
  const commentRatio = commentCount / (codeLines.length || 1);
  
  // Score based on comment ratio
  if (commentRatio === 0) {
    score = 0;
    recommendations.push("Add comments to explain complex code sections");
  } else if (commentRatio < 0.1) {
    score = 5;
    recommendations.push("Add more comments to improve code readability");
  } else if (commentRatio < 0.2) {
    score = 10;
  } else if (commentRatio < 0.3) {
    score = 15;
  } else {
    score = 20;
  }
  
  // Check for function documentation
  if (language === "javascript") {
    const jsFunctions = code.match(/function\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
    const jsDocComments = (code.match(/\/\*\*[\s\S]*?\*\//g) || []).length;
    
    if (jsFunctions.length > 0 && jsDocComments === 0) {
      recommendations.push("Add JSDoc comments for functions to document their purpose and parameters");
      score = Math.max(0, score - 5);
    }
  } else {
    const pyFunctions = code.match(/def\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
    const pyDocstrings = (code.match(/"""[\s\S]*?"""/g) || []).length;
    
    if (pyFunctions.length > 0 && pyDocstrings === 0) {
      recommendations.push("Add a docstring to explain the purpose of the function");
      score = Math.max(0, score - 5);
    }
  }
  
  return {
    score,
    recommendations
  };
}

/**
 * Check function length and modularity
 */
export function checkModularity(
  code: string,
  language: "javascript" | "python"
): {
  score: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let score = 20; // Start with perfect score and deduct
  
  // Identify functions in the code
  const functionBlocks: { name: string; lines: number }[] = [];
  
  if (language === "javascript") {
    // Match JavaScript functions (simplified, doesn't handle all cases)
    const jsFunctionRegex = /function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;
    let match;
    while ((match = jsFunctionRegex.exec(code)) !== null) {
      const funcName = match[1];
      const funcBody = match[2];
      const lines = funcBody.split('\n').filter(line => line.trim() !== '').length;
      functionBlocks.push({ name: funcName, lines });
    }
  } else {
    // Match Python functions (simplified, doesn't handle all cases)
    const pyFunctionRegex = /def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\):/g;
    const codeLines = code.split('\n');
    let match;
    while ((match = pyFunctionRegex.exec(code)) !== null) {
      const funcName = match[1];
      const funcStartIdx = codeLines.findIndex(line => line.includes(match[0]));
      
      if (funcStartIdx !== -1) {
        let lineCount = 0;
        let idx = funcStartIdx + 1;
        
        // Count lines until indentation level returns to the same as the function definition or we reach the end
        const baseIndent = codeLines[funcStartIdx].length - codeLines[funcStartIdx].trimLeft().length;
        
        while (idx < codeLines.length) {
          const line = codeLines[idx];
          if (line.trim() === '') {
            idx++;
            continue;
          }
          
          const indent = line.length - line.trimLeft().length;
          if (indent <= baseIndent) break;
          
          lineCount++;
          idx++;
        }
        
        functionBlocks.push({ name: funcName, lines: lineCount });
      }
    }
  }
  
  // Evaluate function length
  for (const func of functionBlocks) {
    if (func.lines > 30) {
      recommendations.push(`Function '${func.name}' is too long (${func.lines} lines)—consider refactoring`);
      score -= 5;
    } else if (func.lines > 20) {
      recommendations.push(`Function '${func.name}' is getting long—consider breaking it down`);
      score -= 2;
    }
  }
  
  // Check for nested code complexity
  const nestedIfCount = (code.match(/if\s*\([^)]*\)\s*{[^{}]*if\s*\(/g) || []).length;
  const nestedLoopCount = (code.match(/(for|while)\s*\([^)]*\)\s*{[^{}]*(for|while)\s*\(/g) || []).length;
  
  if (nestedIfCount + nestedLoopCount > 3) {
    recommendations.push("Reduce nested conditionals and loops for better readability");
    score -= 3;
  }
  
  return {
    score: Math.max(0, score),
    recommendations
  };
}

/**
 * Check for reusability and DRY principles
 */
export function checkReusability(
  code: string
): {
  score: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let score = 15; // Start with perfect score and deduct
  
  // Look for code duplication (simplified approach)
  const lines = code.split('\n').map(line => line.trim());
  const uniqueLines = new Set(lines);
  
  const duplicationRatio = 1 - uniqueLines.size / lines.length;
  
  if (duplicationRatio > 0.3) {
    recommendations.push("High code duplication detected—extract repeated logic into functions");
    score -= 8;
  } else if (duplicationRatio > 0.15) {
    recommendations.push("Some code duplication detected—consider refactoring");
    score -= 4;
  }
  
  // Check for magic numbers (simplified)
  const magicNumberRegex = /[^A-Za-z0-9_'"]([2-9]|[1-9][0-9]+)[^A-Za-z0-9_'"]/g;
  const magicNumbers = (code.match(magicNumberRegex) || []).length;
  
  if (magicNumbers > 5) {
    recommendations.push("Replace magic numbers with named constants");
    score -= 3;
  }
  
  return {
    score: Math.max(0, score),
    recommendations
  };
}

/**
 * Check for web development best practices
 */
export function checkBestPractices(
  code: string,
  language: "javascript" | "python"
): {
  score: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let score = 20; // Start with perfect score and deduct
  
  if (language === "javascript") {
    // Check for using var instead of let/const
    const varUseCount = (code.match(/\bvar\b/g) || []).length;
    if (varUseCount > 0) {
      recommendations.push("Use 'let' and 'const' instead of 'var' for better scoping");
      score -= 3;
    }
    
    // Check for console.log statements
    const consoleLogCount = (code.match(/console\.log/g) || []).length;
    if (consoleLogCount > 2) {
      recommendations.push("Remove or replace console.log statements in production code");
      score -= 2;
    }
    
    // Check for proper error handling
    const tryCatchCount = (code.match(/try\s*{/g) || []).length;
    const asyncFuncCount = (code.match(/async\s+function|function\s*\(\s*\)\s*{|=>\s*{/g) || []).length;
    
    if (asyncFuncCount > 0 && tryCatchCount === 0) {
      recommendations.push("Add proper error handling for asynchronous operations");
      score -= 3;
    }
    
    // Check for usage of modern features
    if (!code.includes("=>") && !code.includes("...") && !code.includes("const")) {
      recommendations.push("Consider using modern JavaScript features for cleaner code");
      score -= 2;
    }
  } else {
    // Python best practices
    
    // Check for using built-in names
    if (code.includes("sum =") || code.includes("id =") || code.includes("type =") || code.includes("list =")) {
      recommendations.push("Avoid using 'sum' as a variable name—it's a built-in");
      score -= 3;
    }
    
    // Check for proper exception handling
    const tryExceptCount = (code.match(/try:/g) || []).length;
    if (tryExceptCount === 0 && code.length > 100) {
      recommendations.push("Add exception handling with try/except for robust code");
      score -= 2;
    }
    
    // Check for list comprehensions
    const forLoopCount = (code.match(/\bfor\b/g) || []).length;
    const listComprehensionCount = (code.match(/\[\s*[A-Za-z0-9_]+\s+for\s+/g) || []).length;
    
    if (forLoopCount > 2 && listComprehensionCount === 0) {
      recommendations.push("Consider using list comprehensions for more readable code");
      score -= 2;
    }
  }
  
  return {
    score: Math.max(0, score),
    recommendations
  };
}
