/*
  # Create documents table for storing resumes and cover letters

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `type` (text) - either 'resume' or 'cover-letter'
      - `title` (text) - document title
      - `content` (jsonb) - document content
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `documents` table
    - Add policy for public access (no auth required)
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('resume', 'cover-letter')),
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Allow public access to all operations
CREATE POLICY "Public access policy" ON documents
  FOR ALL
  USING (true)
  WITH CHECK (true);