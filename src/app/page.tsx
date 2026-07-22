import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  FileText, 
  FolderOpen, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Command,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'AI-Powered Semantic Search',
      description: 'Find relevant information instantly using natural language queries instead of exact keyword matching.',
      icon: Search,
    },
    {
      title: 'Source-Cited Answers',
      description: 'Every AI response includes references to the original documents for transparency and verification.',
      icon: FileText,
    },
    {
      title: 'Multi-Format Document Support',
      description: 'Upload and search across PDFs, DOCX, Markdown, and text files from a single workspace.',
      icon: FolderOpen,
    },
    {
      title: 'Secure Knowledge Management',
      description: 'Protect your data with authentication, role-based access, and secure document storage.',
      icon: ShieldCheck,
    },
    {
      title: 'Lightning Fast Retrieval',
      description: 'Optimized indexing and vector search deliver answers in seconds, even for large knowledge bases.',
      icon: Zap,
    },
    {
      title: 'Modern & Developer Friendly',
      description: 'Built with modern technologies and a clean interface that makes knowledge discovery effortless.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-900/50">
              <Command className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">KnowledgeHub AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <Button className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shadow-blue-600/20 active:scale-95 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 md:px-8 lg:py-32">
        <div className="w-full max-w-6xl mx-auto space-y-24">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-50">
              Why Choose <span className="text-blue-600 dark:text-blue-500">AI Knowledge Workspace</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Designed to help teams find information faster, reduce time spent searching documentation, and improve knowledge sharing with AI-powered semantic search.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/register">
                <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-medium shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all group">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative flex flex-col p-8 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="relative z-10 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="relative z-10 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 py-8 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} KnowledgeHub AI. Built as a portfolio project.</p>
      </footer>
    </div>
  );
}
