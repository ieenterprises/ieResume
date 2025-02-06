/*
  # Fix documents table and policies

  1. Changes
    - Drop existing table and policies if they exist
    - Recreate documents table with proper structure
    - Set up RLS policies for public access
    - Add updated_at trigger

  2. Security
    - Enable RLS on documents table
    - Create policies for all CRUD operations
    - Allow public access since we're not using authentication

  3. Notes
    - This migration consolidates previous migrations into a single source of truth
    - Ensures proper table structure and policies
    - Adds automatic updated_at timestamp handling
*/

-- Drop existing table and all its dependencies
DROP TABLE IF EXISTS documents CASCADE;

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('resume', 'cover-letter')),
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
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