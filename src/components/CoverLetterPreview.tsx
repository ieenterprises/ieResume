import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { CoverLetterData } from '../types/resume';
import { resumeTemplates } from '../data/resumeTemplates';

interface CoverLetterPreviewProps {
  formData: CoverLetterData;
  templateId: string;
}

export default function CoverLetterPreview({ formData, templateId }: CoverLetterPreviewProps) {
  const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
  
  const getTemplateStyles = () => {
    switch (templateId) {
      case 'minimal-elegant':
        return {
          headingColor: template.primaryColor,
          accentColor: template.accentColor,
          fontClass: 'font-light',
          headerClass: 'border-l-2 pl-4'
        };
      case 'creative-bold':
        return {
          headingColor: template.primaryColor,
          accentColor: template.accentColor,
          fontClass: 'font-black',
          headerClass: 'relative before:absolute before:left-0 before:top-0 before:w-12 before:h-0.5'
        };
      default:
        return {
          headingColor: template.primaryColor,
          accentColor: template.accentColor,
          fontClass: 'font-normal',
          headerClass: ''
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="flex justify-center">
      <div 
        id="cover-letter-preview"
        className="bg-white w-full flex flex-col"
        style={{ 
          minHeight: '100%',
          margin: '0',
          padding: '0',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          fontSize: '11pt',
          lineHeight: '1.5',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Top margin spacer */}
        <div style={{ height: '35mm' }} />

        {/* Main content with side margins */}
        <div className="flex-1 px-[25mm]">
          {/* Header with contact information */}
          <div className={`mb-8 ${styles.headerClass}`}>
            <h1 
              className={`text-2xl ${styles.fontClass} mb-2`}
              style={{ color: styles.headingColor }}
            >
              {formData.fullName}
            </h1>
            <p className="text-gray-700">{formData.title}</p>
            <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
              {formData.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{formData.phone}</span>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="mb-6">
            {formData.letterDate && (
              <p>{new Date(formData.letterDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</p>
            )}
          </div>

          {/* Recipient Info */}
          <div className="mb-6">
            {formData.recipientName && <p>{formData.recipientName}</p>}
            {formData.recipientTitle && <p>{formData.recipientTitle}</p>}
            {formData.companyName && <p>{formData.companyName}</p>}
            {formData.companyAddress && <p>{formData.companyAddress}</p>}
          </div>

          {/* Subject Line */}
          {formData.subject && (
            <div className="mb-6">
              <p className="font-semibold">Subject: {formData.subject}</p>
            </div>
          )}

          {/* Greeting */}
          <div className="mb-6">
            <p>{formData.greeting || 'Dear Hiring Manager,'}</p>
          </div>

          {/* Content */}
          <div 
            className="mb-6 text-gray-800"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />

          {/* Closing */}
          <div>
            <p className="mb-8">{formData.closing || 'Sincerely,'}</p>
            <p>{formData.fullName}</p>
          </div>
        </div>

        {/* Bottom margin spacer - increased to 80mm */}
        <div style={{ height: '80mm' }} />
      </div>
    </div>
  );
}