/*
  # Documents table with public access

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `type` (text, check constraint for 'resume' or 'cover-letter')
      - `title` (text)
      - `content` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `documents` table
    - Add policies for public access to all operations
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('resume', 'cover-letter')),
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public access policy" ON documents;

-- Create separate policies for each operation
CREATE POLICY "Allow public select" ON documents
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert" ON documents
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON documents
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete" ON documents
  FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();