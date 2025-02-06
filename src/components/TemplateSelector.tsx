import React from 'react';
import { ChevronDown } from 'lucide-react';
import { resumeTemplates } from '../data/resumeTemplates';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const selectedTemplateName = resumeTemplates.find(t => t.id === selectedTemplate)?.name || 'Select Template';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Choose Template</h2>
      <div className="relative">
        <select
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {resumeTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} - {template.description}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
      </div>
      
      {/* Preview of selected template */}
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="text-sm text-gray-600">
          <strong>Selected:</strong> {selectedTemplateName}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {resumeTemplates.find(t => t.id === selectedTemplate)?.description}
        </div>
      </div>
    </div>
  );
}