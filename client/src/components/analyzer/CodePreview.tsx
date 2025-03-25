import React, { useState } from 'react';

interface CodePreviewProps {
  fileName: string;
  code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ fileName, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Code Preview</h2>
          <button 
            className="text-sm text-primary hover:text-primary-dark flex items-center"
            onClick={() => {
              // Open in a new tab or expand the view
              const newWindow = window.open('', '_blank');
              newWindow?.document.write(`
                <html>
                  <head>
                    <title>${fileName}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
                    <style>
                      body {
                        font-family: 'Fira Code', monospace;
                        background-color: #1F2937;
                        color: #D1D5DB;
                        padding: 20px;
                        margin: 0;
                      }
                      pre {
                        white-space: pre-wrap;
                      }
                    </style>
                  </head>
                  <body>
                    <pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                  </body>
                </html>
              `);
              newWindow?.document.close();
            }}
          >
            <i className="ri-code-line mr-1"></i> View Full Code
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
            <span className="text-sm text-gray-400">{fileName}</span>
            <div className="flex space-x-2">
              <button 
                className="text-gray-400 hover:text-white"
                onClick={copyToClipboard}
                title={isCopied ? "Copied!" : "Copy to clipboard"}
              >
                <i className={`${isCopied ? "ri-check-line" : "ri-file-copy-line"}`}></i>
              </button>
            </div>
          </div>
          <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto"><code>{code}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
