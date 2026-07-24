import { useState } from "react";
import { toast } from "sonner";
import { DocumentData } from "./useDocuments";

export function useDocumentIndex(
  documents: DocumentData[],
  setDocuments: React.Dispatch<React.SetStateAction<DocumentData[]>>,
  fetchDocuments: () => Promise<void>
) {
  const [isIndexing, setIsIndexing] = useState<Record<string, boolean>>({});

  const indexDocument = async (documentId: string) => {
    if (isIndexing[documentId]) return; // Prevent duplicates

    // Optimistic UI Update: Set to indexing immediately
    setIsIndexing((prev) => ({ ...prev, [documentId]: true }));
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc._id === documentId ? { ...doc, processingStatus: "indexing" as any } : doc
      )
    );
    
    toast.info("Indexing document...");

    try {
      const response = await fetch(`/api/documents/${documentId}/index`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Indexing failed");
      }

      // Update state with success metrics
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc._id === documentId
            ? {
                ...doc,
                processingStatus: "completed",
                chunkCount: data.chunkCount,
                vectorCount: data.vectorCount,
                indexedAt: data.indexedAt,
                embeddingModel: data.embeddingModel,
                indexVersion: data.indexVersion,
              }
            : doc
        )
      );

      toast.success("Document indexed successfully.");
      
      // Ensure absolute consistency
      await fetchDocuments();
      
    } catch (error: any) {
      console.error("Failed to index document:", error);
      
      // Revert status to failed
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc._id === documentId ? { ...doc, processingStatus: "failed" } : doc
        )
      );
      
      toast.error(error.message || "Indexing failed. Please try again.");
    } finally {
      setIsIndexing((prev) => ({ ...prev, [documentId]: false }));
    }
  };

  return { isIndexing, indexDocument };
}
