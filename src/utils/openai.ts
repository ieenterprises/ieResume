import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API key is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true
});

export async function generateAboutMe(title: string): Promise<string> {
  if (!apiKey) {
    return 'Please set your OpenAI API key in the .env file';
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Write a professional, first-person 'About Me' section for a resume (2-3 sentences) for a ${title}. Focus on general expertise and passion for the field.`
      }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating About Me:', error);
    return 'Failed to generate content. Please try again.';
  }
}

export async function generateExperienceDescription(position: string, company: string): Promise<string> {
  if (!apiKey) {
    return 'Please set your OpenAI API key in the .env file';
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Write a professional, bullet-point description of achievements and responsibilities (2-3 points) for a ${position} position at ${company}.`
      }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating experience description:', error);
    return 'Failed to generate content. Please try again.';
  }
}