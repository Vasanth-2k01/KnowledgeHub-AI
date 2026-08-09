"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Search as SearchIcon, Loader2, Filter, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDocuments } from "@/hooks/useDocuments"

interface SearchResult {
  documentId: string
  originalFileName: string
  chunkIndex: number
  text: string
  similarityScore: number
}

interface SearchResponse {
  query: string
  searchedDocuments: string
  totalResults: number
  topK: number
  results: SearchResult[]
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const [response, setResponse] = useState<SearchResponse | null>(null)

  // We reuse the existing useDocuments hook to populate the dropdown filter
  const { documents } = useDocuments()
  
  // Only allow searching within documents that have been successfully indexed
  const indexedDocuments = documents.filter(d => d.processingStatus === "completed")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setIsSearching(true)
    setResponse(null)

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          documentId: selectedDocument || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Search failed")
      }

      setResponse(data)
    } catch (error: any) {
      console.error("Search error:", error)
      toast.error(error.message || "Failed to perform semantic search")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-4 sm:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <SearchIcon className="h-8 w-8 text-blue-600" />
          Semantic Search
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Test semantic retrieval across your indexed knowledge base.
        </p>
      </div>

      {/* Search Controls */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        
        <div className="flex-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Search Query</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="e.g. What are the key takeaways from the Q3 report?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-all"
            />
          </div>
        </div>

        <div className="sm:w-64 flex flex-col">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block flex items-center gap-1">
            <Filter className="h-3 w-3" /> Search In
          </label>
          <select 
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-all cursor-pointer"
          >
            <option value="">Entire Library</option>
            {indexedDocuments.map(doc => (
              <option key={doc._id} value={doc._id}>
                {doc.originalFileName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button 
            type="submit" 
            disabled={isSearching}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm w-full sm:w-auto"
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>

      {/* Results Area */}
      <div className="flex flex-col gap-4">
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
            <p>Searching vectors...</p>
          </div>
        )}

        {!isSearching && response && (
          <>
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                Found {response.totalResults} results
              </h3>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Top K: {response.topK} • Scope: {response.searchedDocuments}
              </div>
            </div>

            {response.results.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 dark:text-zinc-400">No results found above the similarity threshold.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {response.results.map((result, idx) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        {result.originalFileName}
                        <span className="text-zinc-400 font-normal text-xs ml-2">Chunk #{result.chunkIndex}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                          Score: {(result.similarityScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {result.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  )
}
