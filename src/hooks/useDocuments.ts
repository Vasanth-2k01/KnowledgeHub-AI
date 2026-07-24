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
  processingStatus: "uploaded" | "processing" | "completed" | "failed";
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

  return { documents, isLoading, error, fetchDocuments, setDocuments };
}
