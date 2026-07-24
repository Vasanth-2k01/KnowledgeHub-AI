export async function getDocumentsService() {
  const response = await fetch("/api/documents", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Don't cache the documents so we always get the latest on refresh
    cache: "no-store", 
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch documents");
  }

  return data.documents;
}
