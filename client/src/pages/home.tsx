import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import AnalyzerTabs from '@/components/analyzer/AnalyzerTabs';
import FileUploader from '@/components/analyzer/FileUploader';
import ResultsContainer from '@/components/analyzer/ResultsContainer';
import { AnalysisResult } from '@/types/analysis';
import { analyzeCode } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const results = await analyzeCode(file);
      setAnalysisResults(results);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnalyzerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FileUploader 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing} 
          />
          
          <ResultsContainer 
            analysisResults={analysisResults} 
            isLoading={isAnalyzing} 
          />
        </div>
      </main>
      
      <AppFooter />
    </>
  );
}
