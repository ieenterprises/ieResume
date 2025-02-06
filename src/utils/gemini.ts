import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Google Gemini API key is missing. Please check your .env file.');
  }
  return key;
};

const createAIInstance = () => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
    throw error;
  }
};

export async function generateAboutMe(title: string): Promise<string> {
  try {
    const model = createAIInstance();
    const prompt = `Write a professional, first-person 'About Me' section for a resume (2-3 sentences) for a ${title}. Focus on general expertise and passion for the field.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
    throw new Error(`About Me generation failed: ${errorMessage}`);
  }
}

export async function generateExperienceDescription(position: string, company: string): Promise<string> {
  try {
    const model = createAIInstance();
    const prompt = `Write a professional, bullet-point description of achievements and responsibilities (2-3 points) for a ${position} position at ${company}.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
    throw new Error(`Experience description generation failed: ${errorMessage}`);
  }
}

export async function generateSubject(title: string): Promise<string> {
  try {
    const model = createAIInstance();
    // Simply return "Application for [Position]" format
    return `Application for ${title} Position`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
    throw new Error(`Subject generation failed: ${errorMessage}`);
  }
}

export async function generateCoverLetter(title: string, company: string): Promise<string> {
  try {
    const model = createAIInstance();
    const prompt = `Write only the main body paragraphs of a cover letter for a ${title} position at ${company}. Structure it in 3 clear paragraphs without any headers or labels:

    1. Start directly with expressing interest in the position and company, mentioning specific aspects that attract you.
    2. Continue with highlighting your relevant skills and experiences that make you a strong candidate.
    3. End by connecting your background to the company's needs and include a call to action.

    Keep it professional, concise, and persuasive. Do not include any paragraph labels or headers - just write the content directly.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
    throw new Error(`Cover letter generation failed: ${errorMessage}`);
  }
}