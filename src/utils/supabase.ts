import { createClient } from '@supabase/supabase-js';
import type { ResumeData, CoverLetterData } from '../types/resume';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Disable session persistence since we're not using auth
  }
});

export type SavedDocument = {
  id: string;
  type: 'resume' | 'cover-letter';
  title: string;
  content: ResumeData | CoverLetterData;
  created_at: string;
  updated_at: string;
};

export async function saveDocument(
  type: 'resume' | 'cover-letter',
  title: string,
  content: ResumeData | CoverLetterData
): Promise<string | null> {
  try {
    // First, try to insert the document
    const { data, error } = await supabase
      .from('documents')
      .insert([
        { 
          type, 
          title, 
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase request failed', { error });
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error saving document:', error);
    return null;
  }
}

export async function getAllDocuments(): Promise<SavedDocument[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase request failed', { error });
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase request failed', { error });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

export async function getDocument(id: string): Promise<SavedDocument | null> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase request failed', { error });
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}