import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { formatFileSize } from '@/lib/api';
import { FileInfo } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    // Validate file type
    const validExtensions = ['.js', '.jsx', '.py'];
    const fileExt = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExt)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JavaScript (.js, .jsx) or Python (.py) file.",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Code File</h2>
          
          <FileUpload 
            accept=".js,.jsx,.py"
            onFileChange={handleFileChange}
            className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                  <span>Upload a file</span>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Support for .js, .jsx, and .py files
              </p>
            </div>
          </FileUpload>

          {file && (
            <div className="mt-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-md">
                <i className="ri-file-code-line text-xl text-primary mr-3"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={removeFile}
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="mt-4 w-full"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : "Analyze Code"}
          </Button>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Supported Features</h3>
            <ul className="mt-2 text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                <span>Naming conventions analysis</span>
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                <span>Function length & modularity</span>
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                <span>Comments & documentation</span>
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                <span>Code formatting analysis</span>
              </li>
              <li className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                <span>DRY principle evaluation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
