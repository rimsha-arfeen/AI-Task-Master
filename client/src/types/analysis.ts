export interface AnalysisResult {
  overall_score: number;
  breakdown: {
    naming: number;
    modularity: number;
    comments: number;
    formatting: number;
    reusability: number;
    best_practices: number;
  };
  recommendations: string[];
  file_name: string;
  file_size: number;
  file_content: string;
  file_type: 'js' | 'jsx' | 'py';
}

export interface ScoreCategory {
  name: string;
  value: number;
  maxValue: number;
  bgColor: string;
  textColor: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  content: string;
}
