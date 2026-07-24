"use client"

import { useState, useRef, useMemo } from "react"
import { toast } from "sonner"
import { Upload, Search, LayoutGrid, List, FileText, MoreVertical, FileArchive, FileImage, FileBarChart, Loader2, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useDocuments, DocumentData } from "@/hooks/useDocuments"

export default function DocumentsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [sort, setSort] = useState("Newest")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { documents, isLoading, fetchDocuments, setDocuments } = useDocuments()

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Client-side Validation
    const MAX_SIZE = 20 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 20MB.")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    const allowedExtensions = ['.pdf', '.docx', '.txt', '.md']
    const isAllowed = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    if (!isAllowed) {
      toast.error("Invalid file type. Only PDF, DOCX, TXT, and Markdown are allowed.")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    // 2. Upload
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      toast.success("Document uploaded successfully")
      
      // Refresh documents list
      await fetchDocuments()
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Something went wrong during upload")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const filters = ["All", "Uploaded", "Processing", "Completed", "Failed"]
  const sorts = ["Newest", "Oldest", "Name A-Z", "Name Z-A", "File Size"]

  const filteredAndSortedDocs = useMemo(() => {
    let result = [...documents]

    // Filter by Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(doc => doc.originalFileName.toLowerCase().includes(q))
    }

    // Filter by Status
    if (filter !== "All") {
      result = result.filter(doc => doc.processingStatus.toLowerCase() === filter.toLowerCase())
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sort === "Oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sort === "Name A-Z") return a.originalFileName.localeCompare(b.originalFileName)
      if (sort === "Name Z-A") return b.originalFileName.localeCompare(a.originalFileName)
      if (sort === "File Size") return b.fileSize - a.fileSize
      return 0
    })

    return result
  }, [documents, search, filter, sort])

  const getFileIcon = (type: string) => {
    const t = type.toUpperCase()
    if (t.includes('PDF')) return <FileText className="h-5 w-5" />
    if (t.includes('DOCX') || t.includes('WORD')) return <FileText className="h-5 w-5" />
    if (t.includes('TXT') || t.includes('MARKDOWN')) return <FileText className="h-5 w-5" />
    return <FileArchive className="h-5 w-5" />
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    switch (s) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'uploaded': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-1 overflow-y-auto flex-col p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto w-full">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Documents
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage and view your uploaded knowledge files.
          </p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.docx,.txt,.md"
        />
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm h-10 px-5"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>

      {/* Toolbar Area */}
      <div className="flex flex-col gap-4 mb-6">
        
        {/* Search & View Toggles */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 shadow-sm transition-all"
            />
          </div>
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-md ${view === 'grid' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-md ${view === 'list' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === f 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="h-8 rounded-full px-4 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm" />}>
              Sort: {sort}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              {sorts.map((s) => (
                <DropdownMenuItem key={s} onClick={() => setSort(s)} className="cursor-pointer text-sm">
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Documents Area */}
      <div className="min-h-[500px] flex flex-col">
        {isLoading ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col justify-between rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                  <div className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                </div>
                <div className="mt-auto">
                  <div className="h-4 w-3/4 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse mb-2"></div>
                  <div className="h-3 w-1/2 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse mb-3"></div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="h-3 w-1/3 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                    <div className="h-5 w-16 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-x-auto dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm">
            <table className="w-full min-w-[600px] text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Type</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Size</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Date Uploaded</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                        <div className="h-4 w-32 sm:w-48 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 w-12 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 w-16 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 w-24 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
            <File className="h-10 w-10 text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">No documents uploaded</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
            Upload your first document to start building your AI knowledge base.
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm h-10 px-5"
            onClick={handleUploadClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      ) : filteredAndSortedDocs.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No documents match your filters.</p>
         </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedDocs.map((doc) => (
            <div key={doc._id} className="group relative flex flex-col justify-between rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {getFileIcon(doc.fileType)}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" />}>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>Download (Coming Soon)</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>Rename (Coming Soon)</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>Reprocess (Coming Soon)</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>
                      Delete (Coming Soon)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-50 truncate" title={doc.originalFileName}>{doc.originalFileName}</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{formatSize(doc.fileSize)} • {doc.fileType}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate mr-2">{formatDate(doc.createdAt)}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border capitalize ${getStatusColor(doc.processingStatus)}`}>
                    {doc.processingStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-x-auto dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Type</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Size</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Date Uploaded</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredAndSortedDocs.map((doc) => (
                <tr key={doc._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                    <div className="text-zinc-400 flex-shrink-0">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <span className="truncate max-w-[200px] sm:max-w-[300px]" title={doc.originalFileName}>{doc.originalFileName}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 hidden sm:table-cell">{doc.fileType}</td>
                  <td className="px-6 py-4 text-zinc-500 hidden lg:table-cell">{formatSize(doc.fileSize)}</td>
                  <td className="px-6 py-4 text-zinc-500 hidden md:table-cell">{formatDate(doc.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${getStatusColor(doc.processingStatus)}`}>
                      {doc.processingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" />}>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>Download (Coming Soon)</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>Rename (Coming Soon)</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>Reprocess (Coming Soon)</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-not-allowed text-zinc-400" disabled>
                          Delete (Coming Soon)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  )
}
