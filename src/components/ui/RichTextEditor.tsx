import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, List, Wand2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from './Button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onGenerate?: (editor: any) => void;
  generateLabel?: string;
  showGenerateButton?: boolean;
}

export function RichTextEditor({ 
  content, 
  onChange, 
  onGenerate, 
  generateLabel = 'Generate',
  showGenerateButton = false 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[100px] focus:outline-none prose-sm prose-slate',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-gray-50 p-2 flex gap-2 items-center">
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('bold') ? 'primary' : 'secondary'}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('italic') ? 'primary' : 'secondary'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('bulletList') ? 'primary' : 'secondary'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'secondary'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'secondary'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'secondary'}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'secondary'}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>
        {showGenerateButton && onGenerate && (
          <Button
            type="button"
            size="sm"
            className="ml-auto flex items-center gap-1"
            onClick={() => onGenerate(editor)}
          >
            <Wand2 className="w-4 h-4" />
            {generateLabel}
          </Button>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}