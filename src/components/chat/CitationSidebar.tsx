import React, { useEffect, useRef, useState } from 'react';
import { CitationSource } from '@/services/search/semanticSearch';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cleanChunkText } from '@/lib/rag/cleanChunk';

interface CitationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  citations: CitationSource[];
  activeCitationId: string | null;
}

export function CitationSidebar({ isOpen, onClose, citations, activeCitationId }: CitationSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'All' | 'PDF' | 'Doc' | 'Text'>('All');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset filter when closed
  useEffect(() => {
    if (!isOpen) {
      // Wait for the slide-out animation to finish before resetting state
      const timer = setTimeout(() => {
        setFilter('All');
        setExpandedIds(new Set());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll to active citation
  useEffect(() => {
    if (isOpen && activeCitationId && panelRef.current) {
      const activeEl = panelRef.current.querySelector(`[data-citation-id="${activeCitationId}"]`);
      if (activeEl) {
        // Small delay to ensure panel transition has started
        setTimeout(() => {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }
    }
  }, [isOpen, activeCitationId, citations, filter]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getFileType = (fileName: string): 'PDF' | 'Doc' | 'Text' | 'Other' => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'Doc';
    if (ext === 'txt' || ext === 'md') return 'Text';
    return 'Other';
  };

  const pdfCount = citations.filter(c => getFileType(c.fileName) === 'PDF').length;
  const docCount = citations.filter(c => getFileType(c.fileName) === 'Doc').length;
  const textCount = citations.filter(c => getFileType(c.fileName) === 'Text').length;

  const filteredCitations = citations.filter(c => {
    if (filter === 'All') return true;
    return getFileType(c.fileName) === filter;
  });

  const getFileIcon = (fileName: string) => {
    const type = getFileType(fileName);
    if (type === 'PDF') {
      return (
        <FileText className="h-4 w-4 text-red-500 shrink-0" strokeWidth={2.5} />
      );
    }
    if (type === 'Doc') {
      return (
        <FileText className="h-4 w-4 text-blue-600 shrink-0" strokeWidth={2.5} />
      );
    }
    return (
      <FileText className="h-4 w-4 text-zinc-600 shrink-0" strokeWidth={2.5} />
    );
  };

  // If no citations, don't render anything that blocks interaction
  if (!isOpen && citations.length === 0) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-[2px] dark:bg-black/40" 
        onClick={onClose} 
      />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        className={`absolute transition-transform duration-300 ease-out flex flex-col bg-slate-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl
          inset-x-0 bottom-0 top-[15vh] rounded-t-2xl border-t 
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          
          lg:top-0 lg:bottom-0 lg:left-auto lg:right-0 lg:w-[450px] lg:rounded-none lg:border-l lg:border-t-0
          lg:translate-y-0 ${isOpen ? 'lg:translate-x-0' : 'lg:translate-x-full'}
        `}
      >
        <div className="flex flex-col bg-white dark:bg-zinc-950 border-b dark:border-zinc-800/60 z-10 px-5 pt-5 pb-3 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Sources</h2>
              <span className="inline-flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {citations.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
              <X className="h-5 w-5" />
              <span className="sr-only">Close sources</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button 
              onClick={() => setFilter('All')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === 'All' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400'}`}
            >
              All <span className={`text-xs px-1.5 rounded-full ${filter === 'All' ? 'bg-blue-200/50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>{citations.length}</span>
            </button>
            <button 
              onClick={() => setFilter('PDF')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === 'PDF' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400'}`}
            >
              PDF <span className={`text-xs px-1.5 rounded-full ${filter === 'PDF' ? 'bg-blue-200/50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>{pdfCount}</span>
            </button>
            <button 
              onClick={() => setFilter('Doc')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === 'Doc' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400'}`}
            >
              Doc <span className={`text-xs px-1.5 rounded-full ${filter === 'Doc' ? 'bg-blue-200/50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>{docCount}</span>
            </button>
            <button 
              onClick={() => setFilter('Text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === 'Text' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400'}`}
            >
              Text <span className={`text-xs px-1.5 rounded-full ${filter === 'Text' ? 'bg-blue-200/50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>{textCount}</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-zinc-950/50">
          {filteredCitations.map((citation) => {
            const isActive = citation.id === activeCitationId;
            const isExpanded = expandedIds.has(citation.id);
            // Parse SOURCE_1 -> 1
            const match = citation.id.match(/^SOURCE_(\d+)$/);
            const displayIndex = match ? match[1] : '?';
            
            return (
              <div 
                key={citation.id}
                data-citation-id={citation.id}
                className={`relative flex flex-col p-4 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? 'border-blue-300 bg-blue-50/60 dark:border-blue-800/60 dark:bg-blue-900/20 shadow-md shadow-blue-500/5 ring-1 ring-blue-100 dark:ring-blue-900/30' 
                    : 'bg-white dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                    <span className="flex items-center justify-center h-[22px] w-[22px] rounded-full text-[11px] font-bold bg-[#1a73e8] text-white shadow-sm">
                      {displayIndex}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-0 flex-1 pt-0.5">
                    {getFileIcon(citation.fileName)}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                        {citation.fileName}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pl-9">
                  <div className={`text-[13px] leading-[1.6] text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-medium ${!isExpanded ? 'line-clamp-3' : ''}`}>
                    {cleanChunkText(citation.content)}
                  </div>
                  
                  <button 
                    onClick={() => toggleExpand(citation.id)}
                    className="mt-2 text-[#1a73e8] dark:text-blue-400 text-[13px] font-medium hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
