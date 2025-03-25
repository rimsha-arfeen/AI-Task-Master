import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CodePreviewProps {
  code: string;
  fileName: string;
}

export default function CodePreview({ code, fileName }: CodePreviewProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "The code has been copied to your clipboard",
      duration: 3000
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Code Preview</h2>
          <button 
            className="text-sm text-primary hover:text-primary-dark flex items-center"
            onClick={handleCopyCode}
          >
            <Copy className="h-4 w-4 mr-1" /> Copy Code
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
            <span className="text-sm text-gray-400">{fileName}</span>
            <div className="flex space-x-2">
              <button 
                className="text-gray-400 hover:text-white"
                onClick={handleCopyCode}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
