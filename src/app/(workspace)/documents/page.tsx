"use client"

import { useState } from "react"
import { Upload, Search, LayoutGrid, List, FileText, MoreVertical, FileArchive, FileImage, FileBarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const mockDocuments = [
  { id: 1, name: "Project Requirements.pdf", type: "PDF", date: "2026-07-22", status: "Processed" },
  { id: 2, name: "Q3 Financial Report.xlsx", type: "Spreadsheet", date: "2026-07-21", status: "Processing" },
  { id: 3, name: "Employee Handbook.docx", type: "Word Document", date: "2026-07-20", status: "Processed" },
  { id: 4, name: "Architecture Diagram.png", type: "Image", date: "2026-07-19", status: "Failed" },
]

export default function DocumentsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [sort, setSort] = useState("Newest")

  const filters = ["All", "Processed", "Processing", "Failed"]
  const sorts = ["Newest", "Oldest", "Name"]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5" />
      case 'Spreadsheet': return <FileBarChart className="h-5 w-5" />
      case 'Word Document': return <FileText className="h-5 w-5" />
      case 'Image': return <FileImage className="h-5 w-5" />
      default: return <FileArchive className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'Failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
    }
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm h-10 px-5">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
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
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockDocuments.map((doc) => (
            <div key={doc.id} className="group relative flex flex-col justify-between rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {getFileIcon(doc.type)}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" />}>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Rename</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Reprocess</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:text-red-500 dark:focus:text-red-400 dark:focus:bg-red-950/50">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-50 truncate" title={doc.name}>{doc.name}</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{doc.type}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{doc.date}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Type</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Date Uploaded</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {mockDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                    <div className="text-zinc-400">
                      {getFileIcon(doc.type)}
                    </div>
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 hidden sm:table-cell">{doc.type}</td>
                  <td className="px-6 py-4 text-zinc-500 hidden md:table-cell">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" />}>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Rename</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Reprocess</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:text-red-500 dark:focus:text-red-400 dark:focus:bg-red-950/50">
                          Delete
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
  )
}
