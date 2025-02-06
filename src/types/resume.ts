export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface CustomSection {
  title: string;
  content: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  about: string;
  photo: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  customSections?: CustomSection[];
}

export interface CoverLetterData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  letterDate: string;
  greeting: string;
  subject: string;
  content: string;
  closing: string;
}

export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  preview: string;
};