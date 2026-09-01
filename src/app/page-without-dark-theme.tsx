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
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  Workflow,
  Lock,
  Database,
  Cpu
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* Navigation Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-all">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-900/50 group-hover:shadow-blue-500/50 transition-all">
              <Command className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">KnowledgeHub AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/register">
              <Button className="h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white font-medium shadow-sm transition-all active:scale-95 px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        
        {/* HERO SECTION */}
        <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center text-center px-4">
          {/* Abstract Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none translate-y-1/4"></div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-4xl mx-auto space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md mb-4 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">The Future of Enterprise Search</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-zinc-900 dark:text-zinc-50">
              Your Knowledge Base, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Supercharged by AI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Transform your static documents into an intelligent, interactive workspace. Instant answers, verifiable citations, and enterprise-grade security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all group">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="h-12 px-8 rounded-full text-base font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>

          {/* Dynamic Code/Chat Animation Interface */}
          <div className="w-full max-w-5xl mx-auto mt-20 md:mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both px-4">
            <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden group text-left">
              {/* Fake Mac Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-950/80">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
                </div>
                <div className="mx-auto flex items-center justify-center gap-2 px-3 py-1 rounded-md bg-zinc-100/50 dark:bg-zinc-900/50 text-[11px] font-mono text-zinc-500">
                  <Lock className="h-3 w-3" /> https://knowledgehub.ai/chat
                </div>
                <div className="w-[42px]"></div> {/* Spacer for centering */}
              </div>
              
              {/* Fake Chat Interface */}
              <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-transparent to-zinc-50/30 dark:to-zinc-950/30">
                
                {/* User Message */}
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <div className="h-4 w-4 rounded-full bg-zinc-400 dark:bg-zinc-600"></div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm text-sm md:text-base text-zinc-700 dark:text-zinc-300">
                    Explain the integration architecture based on the engineering docs, and include code examples.
                  </div>
                </div>

                {/* AI Response Animation */}
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Command className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 space-y-4 text-sm md:text-base text-zinc-700 dark:text-zinc-300">
                    <p className="leading-relaxed">Based on the provided <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 mx-1 align-middle cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">Source_1</span>, the integration architecture utilizes a microservices approach with Next.js acting as the orchestration layer.</p>
                    
                    {/* Fake Code Block */}
                    <div className="rounded-lg bg-zinc-900 overflow-hidden border border-zinc-800 shadow-inner">
                      <div className="flex items-center px-4 py-2 bg-zinc-950 border-b border-zinc-800 text-xs font-mono text-zinc-500">typescript</div>
                      <div className="p-4 font-mono text-[13px] text-zinc-300 leading-relaxed overflow-x-auto relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>
                        <span className="text-purple-400">export const</span> <span className="text-blue-400">generateResponse</span> = <span className="text-purple-400">async</span> (query: <span className="text-amber-300">string</span>) ={'>'} {'{'}
                        <br />
                        {'  '}<span className="text-zinc-500">// 1. Embed user query</span>
                        <br />
                        {'  '}<span className="text-purple-400">const</span> embedding = <span className="text-purple-400">await</span> createEmbedding(query);
                        <br />
                        <br />
                        {'  '}<span className="text-zinc-500">// 2. Semantic search in Vector DB</span>
                        <br />
                        {'  '}<span className="text-purple-400">const</span> context = <span className="text-purple-400">await</span> qdrantClient.search(embedding);
                        <br />
                        {'}'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section className="w-full py-24 md:py-32 bg-white dark:bg-zinc-950 relative border-t border-zinc-100 dark:border-zinc-900">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Everything you need to build intelligent knowledge bases.
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                A complete toolkit designed to eliminate information silos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              
              {/* Large Bento Card */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 md:p-10 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                    <Database className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Context-Aware RAG</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed flex-1">
                    Upload PDFs, Word documents, Markdown, and text files. Our Retrieval-Augmented Generation pipeline understands the nuanced context of your entire organization.
                  </p>
                </div>
              </div>

              {/* Medium Bento Card 1 */}
              <div className="group relative overflow-hidden rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-colors">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] translate-y-1/4 translate-x-1/4"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Source-Cited Answers</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Zero hallucinations. Every claim made by the AI is backed by a direct, clickable citation to the exact line in your original documents.
                  </p>
                </div>
              </div>

              {/* Medium Bento Card 2 */}
              <div className="group relative overflow-hidden rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-colors">
                 <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -translate-y-1/4 -translate-x-1/4"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Semantic Vector Search</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Find what you mean, not just what you type. Powered by high-dimensional embeddings and ultra-fast vector databases.
                  </p>
                </div>
              </div>

              {/* Wide Bento Card */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-[32px] bg-zinc-950 dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-800 p-8 md:p-10">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold mb-4 border border-zinc-700">
                      <ShieldCheck className="h-3 w-3" /> Enterprise Ready
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Secure, Isolated Workspaces</h3>
                    <p className="text-zinc-400 max-w-sm leading-relaxed">
                      Your data remains entirely yours. Built with granular role-based access controls and robust authentication architectures.
                    </p>
                  </div>
                  <div className="hidden md:flex h-full flex-1 items-center justify-center relative">
                     {/* Abstract secure illustration */}
                     <div className="w-48 h-48 border border-zinc-800 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 border border-zinc-700 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="w-32 h-32 border border-zinc-700 rounded-full flex items-center justify-center bg-zinc-900">
                          <Lock className="h-8 w-8 text-zinc-500" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ROADMAP SECTION (As requested by user) */}
        <section className="w-full py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 relative border-t border-zinc-100 dark:border-zinc-900 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
            <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold tracking-wider text-sm uppercase">
                  <Workflow className="h-4 w-4" /> The Roadmap
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  We're just getting started.
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  KnowledgeHub is rapidly evolving from a passive search engine into an active, intelligent partner.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 -translate-y-1/2 z-0"></div>

              {/* Roadmap Item 1 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 group">
                <div className="h-16 w-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-zinc-50 dark:border-zinc-950 shadow-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Agentic LLM Workflows</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Moving beyond simple QA. We are building autonomous agents capable of reasoning, planning, and executing multi-step tasks across your codebase and documents.
                </p>
              </div>

              {/* Roadmap Item 2 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 group">
                <div className="h-16 w-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-zinc-50 dark:border-zinc-950 shadow-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Unified Chat (RAG + General)</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  A seamless experience combining highly specific document retrieval with the broad, creative capabilities of general-purpose AI models in a single interface.
                </p>
              </div>

              {/* Roadmap Item 3 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 group">
                <div className="h-16 w-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-zinc-50 dark:border-zinc-950 shadow-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Advanced Reasoning</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Deep integration with next-generation models that "think" before they speak, allowing for complex synthesis across hundreds of unrelated documents simultaneously.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="w-full py-24 md:py-32 bg-white dark:bg-zinc-950 relative border-t border-zinc-100 dark:border-zinc-900 text-center px-4">
           <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/5"></div>
           <div className="relative z-10 max-w-3xl mx-auto space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
               Ready to upgrade your team's knowledge?
             </h2>
             <p className="text-lg text-zinc-600 dark:text-zinc-400">
               Join the developers and teams already building the future of work.
             </p>
             <div className="pt-4">
               <Link href="/register">
                 <Button className="h-14 px-10 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white text-lg font-semibold shadow-xl transition-all active:scale-95">
                   Get Started for Free
                 </Button>
               </Link>
             </div>
           </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
                  <Command className="h-3 w-3 text-white" />
                </div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">KnowledgeHub AI</span>
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                The enterprise-grade semantic search and retrieval-augmented generation platform for modern teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Roadmap</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-900 text-sm text-zinc-500 dark:text-zinc-400">
            <p>© {new Date().getFullYear()} KnowledgeHub AI. Built for the future of work.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for the shimmer animation used in the hero mockup */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
