"use client";

import React, { useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";

import { CitationSource } from "@/services/search/semanticSearch";

interface MarkdownRendererProps {
  content: string;
  citations?: CitationSource[];
  onCitationClick?: (id: string) => void;
}

const CitationMarker = ({ label, source, onClick }: { label: string; source?: CitationSource; onClick: () => void }) => (
  <span className="relative inline-block group">
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-blue-50 text-[#1a73e8] text-[11px] font-semibold hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors cursor-pointer border border-blue-100 dark:border-blue-800/50"
      aria-label={`Open source ${label}`}
    >
      {label}
    </button>
    
    {source && (
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 sm:w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-3.5 text-left block">
        <span className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 truncate block">
          {source.fileName}
        </span>
        <span className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-4 block font-medium">
          {source.content}
        </span>
      </span>
    )}
  </span>
);

function renderWithCitations(
  children: React.ReactNode,
  citations?: CitationSource[],
  onClick?: (id: string) => void
): React.ReactNode {
  if (!citations || citations.length === 0 || !onClick) return children;

  const processNode = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      // Split by contiguous blocks of citations, accounting for spaces and commas between them
      const parts = node.split(/((?:\[SOURCE_\d+\][\s,]*)+)/g);
      
      return parts.map((part, i) => {
        if (/^(?:\[SOURCE_\d+\][\s,]*)+$/.test(part)) {
          const sourceMatches = [...part.matchAll(/\[SOURCE_(\d+)\]/g)];
          
          if (sourceMatches.length > 0) {
            return (
              <span key={i} className="inline-flex items-center gap-[3px] mx-1 align-middle">
                {sourceMatches.map((match, j) => {
                  const sourceId = `SOURCE_${match[1]}`;
                  const source = citations.find(c => c.id === sourceId);
                  if (!source) return null;
                  
                  return (
                    <CitationMarker 
                      key={j} 
                      label={match[1]} 
                      source={source} 
                      onClick={() => onClick(source.id)} 
                    />
                  );
                })}
              </span>
            );
          }
        }
        
        return part;
      });
    }
    
    if (Array.isArray(node)) {
      return node.map((child, i) => <React.Fragment key={i}>{processNode(child)}</React.Fragment>);
    }
    
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<any>;
      if (element.props && element.props.children) {
        return React.cloneElement(element, {
          children: processNode(element.props.children)
        });
      }
    }
    
    return node;
  };

  return processNode(children);
}

const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors"
      title="Copy code"
    >
      {isCopied ? (
        <>
          <Check className="h-3 w-3 text-green-400" />
          <span className="text-green-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export function MarkdownRenderer({ content, citations, onCitationClick }: MarkdownRendererProps) {
  const components: Components = {
    // Headings
    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-zinc-100" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-8 mb-5 text-zinc-900 dark:text-zinc-100" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-zinc-900 dark:text-zinc-100" {...props} />,
    h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-4 mb-2 text-zinc-900 dark:text-zinc-100" {...props} />,
    
    // Paragraphs
    p: ({ node, children, ...props }) => <p className="mb-4 last:mb-0 leading-[1.6]" {...props}>{renderWithCitations(children, citations, onCitationClick)}</p>,
    
    // Lists
    ul: ({ node, ...props }) => <ul className="list-disc list-outside mb-4 last:mb-0 space-y-1.5 ml-6" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-outside mb-4 last:mb-0 space-y-1.5 ml-6" {...props} />,
    li: ({ node, children, ...props }) => <li className="text-[15px] leading-[1.6] mb-1.5 last:mb-0" {...props}>{renderWithCitations(children, citations, onCitationClick)}</li>,
    
    // Links
    a: ({ node, ...props }) => (
      <a 
        className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-2" 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props} 
      />
    ),
    
    // Blockquote
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 py-1 my-4 last:mb-0 text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/50 rounded-r-md" {...props} />
    ),
    
    // Horizontal Rule
    hr: ({ node, ...props }) => <hr className="my-6 border-zinc-200 dark:border-zinc-800" {...props} />,
    
    // Tables
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm border-collapse" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800" {...props} />,
    th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
    td: ({ node, children, ...props }) => <td className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0" {...props}>{renderWithCitations(children, citations, onCitationClick)}</td>,
    tr: ({ node, ...props }) => <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors" {...props} />,
    
    // Code blocks and inline code
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      
      // Handle fenced code blocks
      if (match) {
        const language = match[1];
        const codeString = String(children).replace(/\n$/, "");
        
        return (
          <div className="relative group rounded-lg bg-[#0d1117] overflow-hidden my-6 last:mb-0 border border-zinc-800">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 select-none uppercase tracking-wider">{language}</span>
              <CopyButton text={codeString} />
            </div>
            <div className="p-4 overflow-x-auto text-[13.5px] leading-relaxed font-mono">
              <code className={className} {...props}>
                {children}
              </code>
            </div>
          </div>
        );
      }
      
      // Inline code
      return (
        <code className="bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded-[4px] text-[13px] font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/50" {...props}>
          {children}
        </code>
      );
    },
    
    // We override pre to just pass children through, because we render the wrapper in `code`
    // Otherwise we'd get a double-wrapped block. react-markdown puts <code> inside <pre> for code blocks.
    pre: ({ node, children, ...props }) => {
      // If the child is a code element (which is the case for fenced blocks), 
      // just render the children to avoid double-wrapping styling issues.
      return <div className="not-prose">{children}</div>;
    },
  };

  return (
    <div className="prose dark:prose-invert max-w-none break-words">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
