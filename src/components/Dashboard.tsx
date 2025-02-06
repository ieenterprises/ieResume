import React, { useEffect, useState } from 'react';
import { FileText, FileSignature, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { getAllDocuments, deleteDocument, type SavedDocument } from '../utils/supabase';

interface DashboardProps {
  onClose: () => void;
  onOpenDocument: (document: SavedDocument) => void;
}

export function Dashboard({ onClose, onOpenDocument }: DashboardProps) {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    const docs = await getAllDocuments();
    setDocuments(docs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    const success = await deleteDocument(id);
    if (success) {
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } else {
      setError('Failed to delete document');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Documents</h2>
          <div className="flex gap-2">
            <Button
              onClick={loadDocuments}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No documents saved yet</div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {doc.type === 'resume' ? (
                      <FileText className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FileSignature className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-gray-500">
                        Last modified: {formatDate(doc.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onOpenDocument(doc)}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Button>
                    <Button
                      onClick={() => handleDelete(doc.id)}
                      variant="secondary"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}