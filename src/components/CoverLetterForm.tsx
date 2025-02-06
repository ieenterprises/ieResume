import React from 'react';
import { Button } from './ui/Button';
import { RichTextEditor } from './ui/RichTextEditor';
import type { CoverLetterData } from '../types/resume';
import { generateCoverLetter, generateSubject } from '../utils/gemini';

interface CoverLetterFormProps {
  formData: CoverLetterData;
  setFormData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
}

export default function CoverLetterForm({ formData, setFormData }: CoverLetterFormProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerateCoverLetter = async (editor: any) => {
    if (!formData.title || !formData.companyName) {
      setError('Please enter your applied position and company name first');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const [generatedContent, generatedSubject] = await Promise.all([
        generateCoverLetter(formData.title, formData.companyName),
        generateSubject(formData.title)
      ]);
      editor.commands.setContent(generatedContent);
      setFormData(prev => ({ 
        ...prev, 
        content: generatedContent,
        subject: generatedSubject
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Cover Letter Information</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Personal Information */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.fullName}
              onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Applied Position</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>

        {/* Recipient Information */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Recipient's Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.recipientName}
              onChange={e => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Recipient's Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.recipientTitle}
              onChange={e => setFormData(prev => ({ ...prev, recipientTitle: e.target.value }))}
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.companyName}
              onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Company Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.companyAddress}
              onChange={e => setFormData(prev => ({ ...prev, companyAddress: e.target.value }))}
            />
          </div>
        </div>

        {/* Letter Details */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.letterDate}
              onChange={e => setFormData(prev => ({ ...prev, letterDate: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Greeting</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Dear Mr./Ms. Last Name,"
              value={formData.greeting}
              onChange={e => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
            />
          </div>
        </div>

        {/* Subject Line */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject Line</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.subject}
            onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Will be generated with the content"
          />
        </div>

        {/* Letter Content */}
        <div>
          <label className="block text-sm font-medium mb-1">Letter Content</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            onGenerate={handleGenerateCoverLetter}
            generateLabel={isGenerating ? 'Generating...' : 'Generate Cover Letter'}
            showGenerateButton
          />
        </div>

        {/* Closing */}
        <div>
          <label className="block text-sm font-medium mb-1">Closing</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Sincerely,"
            value={formData.closing}
            onChange={e => setFormData(prev => ({ ...prev, closing: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}