import { AnalysisResult } from "../types/analysis";

export async function analyzeCode(file: File): Promise<AnalysisResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/analyze-code', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error analyzing code: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
