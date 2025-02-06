import React from 'react';
import { Mail, MapPin, Phone, Calendar } from 'lucide-react';
import type { ResumeData } from '../types/resume';
import { resumeTemplates } from '../data/resumeTemplates';

interface ResumePreviewProps {
  formData: ResumeData;
  templateId: string;
}

export default function ResumePreview({ formData, templateId }: ResumePreviewProps) {
  const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
  
  const getTemplateStyles = () => {
    switch (templateId) {
      case 'minimal-elegant':
        return {
          headingColor: template.primaryColor,
          accentColor: template.accentColor,
          headingClass: 'font-light',
          sectionClass: 'border-l-2 pl-4',
          skillsLayout: 'flex flex-wrap gap-2'
        };
      case 'creative-bold':
        return {
          headingColor: template.primaryColor,
          accentColor: template.accentColor,
          headingClass: 'font-black uppercase',
          sectionClass: 'relative before:absolute before:left-0 before:top-0 before:w-12 before:h-0.5',
          skillsLayout: 'grid grid-cols-3 gap-2'
        };
      default:
        return {
          headingColor: template.primaryColor,
          accentColor: template.accentColor,
          headingClass: 'font-normal',
          sectionClass: '',
          skillsLayout: 'grid grid-cols-2 gap-x-6 gap-y-1'
        };
    }
  };

  const styles = getTemplateStyles();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex justify-center">
      <div 
        id="resume-preview"
        className="bg-white"
        style={{ 
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm',
          margin: '0 auto',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          fontSize: '9pt',
          lineHeight: '1.3',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex gap-4 items-start mb-4">
          {formData.photo && (
            <img
              src={formData.photo}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
              crossOrigin="anonymous"
            />
          )}
          <div className="flex-1">
            <h1 
              style={{ fontSize: '16pt', color: styles.accentColor }} 
              className={`${styles.headingClass} mb-1`}
            >
              {formData.fullName}
            </h1>
            <p style={{ fontSize: '11pt' }} className="text-gray-700 mb-2">{formData.title}</p>
            <div className="flex flex-wrap gap-3 text-gray-600" style={{ fontSize: '8.5pt' }}>
              {formData.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" style={{ color: styles.headingColor }} />
                  <span>{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" style={{ color: styles.headingColor }} />
                  <span>{formData.phone}</span>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" style={{ color: styles.headingColor }} />
                  <span>{formData.location}</span>
                </div>
              )}
              {formData.dateOfBirth && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" style={{ color: styles.headingColor }} />
                  <span>Born: {formatDate(formData.dateOfBirth)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {formData.about && (
          <div className={`mb-4 ${styles.sectionClass}`}>
            <h2 
              style={{ fontSize: '11pt', color: styles.headingColor }} 
              className={`${styles.headingClass} mb-1`}
            >
              Summary
            </h2>
            <div 
              className="text-gray-700"
              style={{ fontSize: '9pt', lineHeight: '1.4' }}
              dangerouslySetInnerHTML={{ __html: formData.about }}
            />
          </div>
        )}

        {formData.skills.length > 0 && (
          <div className={`mb-4 ${styles.sectionClass}`}>
            <h2 
              style={{ fontSize: '11pt', color: styles.headingColor }} 
              className={`${styles.headingClass} mb-1`}
            >
              Skill Highlights
            </h2>
            <div className={styles.skillsLayout}>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2" style={{ fontSize: '9pt' }}>
                  <span 
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: styles.headingColor }}
                  ></span>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.experience.length > 0 && (
          <div className={`mb-4 ${styles.sectionClass}`}>
            <h2 
              style={{ fontSize: '11pt', color: styles.headingColor }} 
              className={`${styles.headingClass} mb-1`}
            >
              Experience
            </h2>
            <div className="space-y-3">
              {formData.experience.map((exp, index) => (
                <div key={index} style={{ fontSize: '9pt' }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-gray-600" style={{ fontSize: '8.5pt' }}>{exp.duration}</span>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{exp.company}</p>
                  <div 
                    className="text-gray-600 pl-3"
                    style={{ lineHeight: '1.3' }}
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.education.length > 0 && (
          <div className={`mb-4 ${styles.sectionClass}`}>
            <h2 
              style={{ fontSize: '11pt', color: styles.headingColor }} 
              className={`${styles.headingClass} mb-1`}
            >
              Education
            </h2>
            <div className="space-y-2">
              {formData.education.map((edu, index) => (
                <div key={index} style={{ fontSize: '9pt' }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <span className="text-gray-600" style={{ fontSize: '8.5pt' }}>{edu.year}</span>
                  </div>
                  <p className="text-gray-700">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.customSections?.map((section, index) => (
          <div key={index} className={`mb-4 ${styles.sectionClass}`}>
            <h2 
              style={{ fontSize: '11pt', color: styles.headingColor }} 
              className={`${styles.headingClass} mb-1`}
            >
              {section.title}
            </h2>
            <div 
              className="text-gray-700"
              style={{ fontSize: '9pt', lineHeight: '1.3' }}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}