import React, { useState } from 'react';
import { Printer, Download, X } from 'lucide-react';
import { Button } from './ui/Button';

interface DocumentPreviewProps {
  previewRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  onDownload: () => void;
  type: 'resume' | 'coverLetter';
}

export function DocumentPreview({ previewRef, onClose, onDownload, type }: DocumentPreviewProps) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const simulateDownloadProgress = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate progress in smaller increments for smoother animation
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 20)); // 20ms delay between updates
      setDownloadProgress(i);
      
      // When progress reaches 100%, trigger the download
      if (i === 100) {
        // Small delay to ensure the progress bar is visible at 100%
        await new Promise(resolve => setTimeout(resolve, 200));
        await onDownload();
        setIsDownloading(false);
        setDownloadProgress(0);
      }
    }
  };

  const handlePrint = () => {
    if (!previewRef.current) return;

    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    const content = previewRef.current.cloneNode(true) as HTMLElement;
    content.className = previewRef.current.className;
    
    printContainer.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      background: white;
      z-index: 9999;
      padding: 0;
    `;

    content.style.cssText += `
      width: 100%;
      min-height: 100%;
      padding: 0;
      margin: 0;
      background: white;
      box-shadow: none;
      transform: scale(1);
      transform-origin: top center;
    `;

    printContainer.appendChild(content);
    document.body.appendChild(printContainer);

    window.print();

    document.body.removeChild(printContainer);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center">
      <div className="bg-white w-full h-full md:w-[95%] md:h-[95%] md:rounded-lg flex flex-col">
        {/* Header */}
        <div className="p-0.5 border-b flex items-center justify-between bg-gray-50 md:rounded-t-lg">
          <div className="flex items-center gap-1">
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
            <h2 className="text-lg font-semibold">
              {type === 'resume' ? 'Resume' : 'Cover Letter'} Preview
            </h2>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-0.5">
          <div className="w-full bg-white shadow-lg transform scale-95 origin-top">
            {previewRef.current && (
              <div 
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: previewRef.current.innerHTML }}
              />
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-0.5 border-t bg-gray-50 md:rounded-b-lg">
          <div className="flex justify-center gap-2">
            <div className="relative">
              <Button
                onClick={simulateDownloadProgress}
                disabled={isDownloading}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 relative overflow-hidden"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? `Generating PDF ${downloadProgress}%` : 'Download PDF'}
                {isDownloading && (
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-100"
                    style={{ width: `${downloadProgress}%` }}
                  />
                )}
              </Button>
            </div>
            <Button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}