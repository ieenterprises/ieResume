import React, { useState, useRef } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import CoverLetterForm from './components/CoverLetterForm';
import CoverLetterPreview from './components/CoverLetterPreview';
import { DocumentPreview } from './components/DocumentPreview';
import { TemplateSelector } from './components/TemplateSelector';
import { Button } from './components/ui/Button';
import { FileText, FileSignature } from 'lucide-react';
import { generatePDF } from './utils/pdfExport';
import type { ResumeData, CoverLetterData } from './types/resume';

const initialResumeData: ResumeData = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  dateOfBirth: '',
  about: '',
  photo: '',
  experience: [],
  education: [],
  skills: [],
  customSections: []
};

const initialCoverLetterData: CoverLetterData = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  recipientName: '',
  recipientTitle: '',
  companyName: '',
  companyAddress: '',
  letterDate: new Date().toISOString().split('T')[0],
  greeting: 'Dear Hiring Manager,',
  subject: '',
  content: '',
  closing: 'Sincerely,'
};

function App() {
  const [formData, setFormData] = useState<ResumeData>(initialResumeData);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(initialCoverLetterData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-professional');
  const [activeDocument, setActiveDocument] = useState<'resume' | 'coverLetter'>('resume');
  const [showPreview, setShowPreview] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const coverLetterRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const ref = activeDocument === 'resume' ? resumeRef.current : coverLetterRef.current;
      await generatePDF(ref, activeDocument === 'resume' ? 'resume' : 'cover-letter');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white/95">
      <header className="bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-6">
          <img 
            src="https://media-hosting.imagekit.io//86bb41c4bb76409d/ieResume-logo.png?Expires=1833451823&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=gv8F6ai64DJ1Jp7zfxYx5cOWUIdUHJlNbnFy2pipOwoRZijc1TB2lS8FjIRm4v83AhZaybA5WXh~Jng65HYo2ed7h4wQyoaPR2qEF3vIGtJ41mcxk3iN2tNcU7WcRt2QvbPsLe2815we2PC-443oWbhffe5a31xFbrJ8ln~CadlspPLdnntjzS0mR6caYSOX8ejX3ExYMy7JHmkd4DvJ2g8b4yQz805F2FVdsfAVx9tGaL42AVfhmVC1rb5XCvYLARJJPuba8gD7Zze~PQ52YWd-JXTVUHpRhmwUFueWsna2coeWf12SdL-X3csBopXEACLPkN3mIAKimkBlv-qIqg__"
            alt="ieResume"
            className="h-16 w-16 object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">ieResume Builder</h1>
            <p className="text-white/80 text-sm">Powered by AI - Create Professional Resumes & Cover Letters</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-4">
          <Button
            onClick={() => setActiveDocument('resume')}
            className={`flex items-center gap-2 ${activeDocument === 'resume' ? 'bg-[#4c5254] text-white' : 'bg-gray-200 text-gray-800 hover:bg-[#d9d9d9]'}`}
          >
            <FileText className="w-5 h-5" />
            Resume
          </Button>
          <Button
            onClick={() => setActiveDocument('coverLetter')}
            className={`flex items-center gap-2 ${activeDocument === 'coverLetter' ? 'bg-[#4c5254] text-white' : 'bg-gray-200 text-gray-800 hover:bg-[#d9d9d9]'}`}
          >
            <FileSignature className="w-5 h-5" />
            Cover Letter
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
            {activeDocument === 'resume' ? (
              <ResumeForm formData={formData} setFormData={setFormData} />
            ) : (
              <CoverLetterForm formData={coverLetterData} setFormData={setCoverLetterData} />
            )}
          </div>
          
          <div className="lg:w-1/2">
            <div className="sticky top-8">
              <div className="mb-4">
                <Button
                  onClick={handleGenerate}
                  className="w-full bg-accent-blue hover:bg-accent-blue/90"
                  size="lg"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Generate
                </Button>
              </div>
              <div className="overflow-auto max-h-[calc(100vh-12rem)]">
                {activeDocument === 'resume' ? (
                  <div ref={resumeRef}>
                    <ResumePreview formData={formData} templateId={selectedTemplate} />
                  </div>
                ) : (
                  <div ref={coverLetterRef}>
                    <CoverLetterPreview formData={coverLetterData} templateId={selectedTemplate} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPreview && (
        <DocumentPreview
          previewRef={activeDocument === 'resume' ? resumeRef : coverLetterRef}
          onClose={() => setShowPreview(false)}
          onDownload={handleDownload}
          type={activeDocument}
        />
      )}
    </div>
  );
}

export default App;