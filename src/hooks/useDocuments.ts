import { useState, useEffect, useCallback } from "react";
import { getDocumentsService } from "@/services/documents/getDocuments";
import { toast } from "sonner";

export interface DocumentData {
  _id: string;
  originalFileName: string;
  storedFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  processingStatus: "uploaded" | "processing" | "completed" | "failed" | "indexing";
  indexedAt?: string;
  chunkCount?: number;
  vectorCount?: number;
  embeddingModel?: string;
  indexVersion?: number;
  createdAt: string;
  updatedAt: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDocumentsService();
      setDocuments(data);
    } catch (err: any) {
      console.error("Failed to fetch documents:", err);
      setError(err.message || "Failed to load documents");
      toast.error(err.message || "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);


  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete document");
      
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      toast.success("Document deleted");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const downloadDocument = async (id: string, filename: string) => {
    try {
      const response = await fetch(`/api/documents/${id}/download`, {
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to download document");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  return { 
    documents, 
    isLoading, 
    error, 
    fetchDocuments, 
    setDocuments,
    deleteDocument,
    downloadDocument
  };
}
