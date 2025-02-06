import React, { useState } from 'react';
import { Camera, Mail, MapPin, Phone, Trash2, Calendar } from 'lucide-react';
import { generateAboutMe, generateExperienceDescription } from '../utils/gemini';
import { Button } from './ui/Button';
import { RichTextEditor } from './ui/RichTextEditor';
import type { ResumeData, CustomSection } from '../types/resume';

interface ResumeFormProps {
  formData: ResumeData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function ResumeForm({ formData, setFormData }: ResumeFormProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [customSectionTitle, setCustomSectionTitle] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  const handleGenerateAboutMe = async (editor: any) => {
    if (!formData.title) {
      setError('Please enter a professional title first');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const generatedAbout = await generateAboutMe(formData.title);
      editor.commands.setContent(generatedAbout);
      setFormData(prev => ({ ...prev, about: generatedAbout }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDescription = async (index: number, editor: any) => {
    const exp = formData.experience[index];
    if (!exp.position || !exp.company) {
      setError('Please enter both position and company first');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const generatedDescription = await generateExperienceDescription(exp.position, exp.company);
      editor.commands.setContent(generatedDescription);
      const newExp = [...formData.experience];
      newExp[index].description = generatedDescription;
      setFormData(prev => ({ ...prev, experience: newExp }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }]
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', year: '' }]
    }));
  };

  const addCustomSection = () => {
    if (!customSectionTitle.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), { title: customSectionTitle, content: '' }]
    }));
    setCustomSectionTitle('');
  };

  const removeCustomSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections?.filter((_, i) => i !== index)
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Professional Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              <Mail className="inline w-4 h-4 mr-1" /> Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              <Phone className="inline w-4 h-4 mr-1" /> Phone
            </label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              <MapPin className="inline w-4 h-4 mr-1" /> Location
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              <Calendar className="inline w-4 h-4 mr-1" /> Date of Birth
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.dateOfBirth}
              onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            <Camera className="inline w-4 h-4 mr-1" /> Photo
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              className="flex-1 p-2 border rounded"
              onChange={handlePhotoUpload}
            />
            {formData.photo && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleDeletePhoto}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">About Me</label>
          </div>
          <RichTextEditor
            content={formData.about}
            onChange={(content) => setFormData(prev => ({ ...prev, about: content }))}
            onGenerate={handleGenerateAboutMe}
            generateLabel={isGenerating ? 'Generating...' : 'Generate'}
            showGenerateButton
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded relative">
              <button
                onClick={() => removeExperience(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
              <input
                type="text"
                placeholder="Company"
                className="w-full p-2 border rounded mb-2"
                value={exp.company}
                onChange={e => {
                  const newExp = [...formData.experience];
                  newExp[index].company = e.target.value;
                  setFormData(prev => ({ ...prev, experience: newExp }));
                }}
              />
              <input
                type="text"
                placeholder="Position"
                className="w-full p-2 border rounded mb-2"
                value={exp.position}
                onChange={e => {
                  const newExp = [...formData.experience];
                  newExp[index].position = e.target.value;
                  setFormData(prev => ({ ...prev, experience: newExp }));
                }}
              />
              <input
                type="text"
                placeholder="Duration"
                className="w-full p-2 border rounded mb-2"
                value={exp.duration}
                onChange={e => {
                  const newExp = [...formData.experience];
                  newExp[index].duration = e.target.value;
                  setFormData(prev => ({ ...prev, experience: newExp }));
                }}
              />
              <RichTextEditor
                content={exp.description}
                onChange={(content) => {
                  const newExp = [...formData.experience];
                  newExp[index].description = content;
                  setFormData(prev => ({ ...prev, experience: newExp }));
                }}
                onGenerate={(editor) => handleGenerateDescription(index, editor)}
                generateLabel={isGenerating ? 'Generating...' : 'Generate'}
                showGenerateButton
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={addExperience}
            className="w-full"
          >
            Add Experience
          </Button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-4 p-4 border rounded relative">
              <button
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
              <input
                type="text"
                placeholder="School"
                className="w-full p-2 border rounded mb-2"
                value={edu.school}
                onChange={e => {
                  const newEdu = [...formData.education];
                  newEdu[index].school = e.target.value;
                  setFormData(prev => ({ ...prev, education: newEdu }));
                }}
              />
              <input
                type="text"
                placeholder="Degree"
                className="w-full p-2 border rounded mb-2"
                value={edu.degree}
                onChange={e => {
                  const newEdu = [...formData.education];
                  newEdu[index].degree = e.target.value;
                  setFormData(prev => ({ ...prev, education: newEdu }));
                }}
              />
              <input
                type="text"
                placeholder="Year"
                className="w-full p-2 border rounded"
                value={edu.year}
                onChange={e => {
                  const newEdu = [...formData.education];
                  newEdu[index].year = e.target.value;
                  setFormData(prev => ({ ...prev, education: newEdu }));
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={addEducation}
            className="w-full"
          >
            Add Education
          </Button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Skills</h3>
          <input
            type="text"
            placeholder="Add skills (comma-separated)"
            className="w-full p-2 border rounded"
            value={formData.skills.join(', ')}
            onChange={e => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean) }))}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Custom Sections</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Section Title (e.g., References, Publications)"
              className="flex-1 p-2 border rounded"
              value={customSectionTitle}
              onChange={(e) => setCustomSectionTitle(e.target.value)}
            />
            <Button
              type="button"
              onClick={addCustomSection}
              disabled={!customSectionTitle.trim()}
            >
              Add Section
            </Button>
          </div>
          
          {formData.customSections?.map((section, index) => (
            <div key={index} className="mb-4 p-4 border rounded relative">
              <button
                onClick={() => removeCustomSection(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
              <h4 className="font-medium mb-2">{section.title}</h4>
              <RichTextEditor
                content={section.content}
                onChange={(content) => {
                  const newSections = [...(formData.customSections || [])];
                  newSections[index].content = content;
                  setFormData(prev => ({ ...prev, customSections: newSections }));
                }}
                showGenerateButton={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}