"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Command, ArrowRight, User, Bot, File, Database, 
  Search, Link as LinkIcon, ShieldCheck, FolderOpen,
  Network, Send, Workflow, Briefcase, Zap,
  Layers, Lightbulb, Blocks
} from 'lucide-react';

// ==========================================
// 1. NAVIGATION
// ==========================================
const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white transition-colors">
            <Command className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
            KnowledgeHub AI
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#product" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Product</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How It Works</Link>
          <Link href="#sources" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sources</Link>
          <Link href="#use-cases" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Use Cases</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/register">
            <Button className="h-8 md:h-9 rounded-full bg-zinc-100 text-zinc-950 hover:bg-white font-medium px-4 text-xs cursor-pointer">
              Get Started <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

// ==========================================
// 2. HERO
// ==========================================
const Hero = () => {
  return (
    <section className="w-full pt-32 pb-12 md:pt-48 md:pb-20 flex flex-col items-center px-4 relative z-10 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl mx-auto flex flex-col items-center"
      >
        <p className="text-sm font-bold tracking-[0.2em] text-blue-500 mb-6 uppercase">
          AI-POWERED KNOWLEDGE WORKSPACE
        </p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-white mb-6">
          TURN YOUR DOCUMENTS<br />
          <span className="text-zinc-500">INTO ANSWERS.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8 px-4">
          Connect your documents to an intelligent knowledge workspace. Ask questions naturally, get answers grounded in your knowledge, and explore the sources behind every response.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register">
            <Button className="h-12 w-full sm:w-auto px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-base font-medium transition-colors shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] cursor-pointer">
              Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#product" className="w-full sm:w-auto">
            <Button variant="ghost" className="h-12 w-full sm:w-auto px-6 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer">
              See How It Works
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

// ==========================================
// 3. LARGE PRODUCT EXPERIENCE
// ==========================================
const ProductExperience = () => {
  const [demoState, setDemoState] = useState<'idle' | 'typing' | 'user_posted' | 'searching' | 'answered'>('idle');
  const [typedText, setTypedText] = useState('');
  const fullText = "What authentication methods does the platform use?";
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setDemoState('typing');
      for (let i = 0; i <= fullText.length; i++) {
        setTypedText(fullText.substring(0, i));
        await new Promise(r => setTimeout(r, 35));
      }
      await new Promise(r => setTimeout(r, 300));
      setDemoState('user_posted');
      await new Promise(r => setTimeout(r, 400));
      setDemoState('searching');
      await new Promise(r => setTimeout(r, 1500));
      setDemoState('answered');
    };
    sequence();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="product" className="w-full pb-24 md:pb-32 flex justify-center px-4 relative z-10 scroll-mt-24">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/5 flex flex-col md:flex-row">
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col border-r border-zinc-900">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <Command className="h-4 w-4 text-zinc-500" />
                <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase hidden sm:block">KnowledgeHub</span>
              </div>
            </div>

            <div className="p-4 md:p-8 flex flex-col min-h-[400px] justify-end gap-8 flex-1">
              <div className="flex flex-col gap-8 flex-1 justify-end">
                <AnimatePresence>
                  {(demoState === 'user_posted' || demoState === 'searching' || demoState === 'answered') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                      {/* User Message */}
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex gap-3 md:gap-4 justify-end">
                        <div className="px-4 py-3 rounded-2xl bg-zinc-800 text-zinc-100 rounded-tr-sm text-[14px] md:text-[15px] leading-relaxed shadow-sm">
                          {fullText}
                        </div>
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                          <User className="h-4 w-4" />
                        </div>
                      </motion.div>

                      {/* AI Response */}
                      {demoState === 'answered' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex gap-3 md:gap-4 justify-start">
                          <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-900/30 flex items-center justify-center text-blue-400 border border-blue-800/30">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col gap-3 w-full max-w-[95%]">
                            <div className="px-4 md:px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm text-[14px] md:text-[15px] leading-relaxed shadow-sm">
                              <p>
                                The application uses JWT authentication and role-based access control to manage user permissions and secure protected resources.
                                <span className="inline-flex items-center justify-center ml-1.5 mr-0.5 w-5 h-5 rounded bg-blue-900/40 text-blue-400 text-[10px] font-mono border border-blue-800/50 cursor-pointer hover:bg-blue-800/50 transition-colors relative -top-0.5">1</span>
                                <span className="inline-flex items-center justify-center ml-1.5 w-5 h-5 rounded bg-blue-900/40 text-blue-400 text-[10px] font-mono border border-blue-800/50 cursor-pointer hover:bg-blue-800/50 transition-colors relative -top-0.5">2</span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Box Mockup */}
              <div className="relative flex items-center justify-between p-3 pl-5 mt-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-100 text-sm md:text-base">
                {demoState === 'idle' && <span className="text-zinc-600 absolute left-5 pointer-events-none">Ask anything about your knowledge...</span>}
                {(demoState === 'user_posted' || demoState === 'answered') && <span className="text-zinc-600 absolute left-5 pointer-events-none">Ask a follow-up question...</span>}
                <span className="relative z-10">{(demoState === 'idle' || demoState === 'typing') ? typedText : ''}</span>
                {demoState === 'typing' && <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-5 bg-blue-500 ml-1" />}
                {demoState === 'searching' && (
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-zinc-500 font-medium ml-2 mr-8">Searching knowledge...</span>
                  </div>
                )}
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 ml-auto z-10 relative cursor-pointer hover:bg-zinc-700 transition-colors">
                  <Send className="h-4 w-4 ml-[-2px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Sources */}
          <div className="w-full md:w-80 bg-zinc-900/20 p-6 flex flex-col gap-4 border-t md:border-t-0 border-zinc-900">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 pb-2 border-b border-zinc-800/50">
              <Database className="h-4 w-4 text-zinc-500" /> Source View
            </div>
            {demoState === 'answered' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3">
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors cursor-pointer ring-1 ring-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center justify-center border border-zinc-700">1</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200"><File className="h-3.5 w-3.5 text-blue-500" /><span className="truncate">Architecture.pdf</span></div>
                      <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider font-semibold">Authentication</div>
                      <div className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed border-l-2 border-zinc-800 pl-2">
                        "...implementation utilizes JWT authentication and authorization. Upon successful login..."
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center justify-center border border-zinc-700">2</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200"><File className="h-3.5 w-3.5 text-blue-500" /><span className="truncate">Security.pdf</span></div>
                      <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider font-semibold">Access Control</div>
                      <div className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed border-l-2 border-zinc-800 pl-2">
                        "...enforces role-based permissions at the API gateway layer to validate administrative actions..."
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </div>

        </div>
      </motion.div>
    </section>
  );
};

// ==========================================
// 4. PROBLEM / TRANSFORMATION
// ==========================================
const ProblemTransformation = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-zinc-900/30 border-y border-zinc-900 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-16 md:mb-24">
          YOUR KNOWLEDGE IS EVERYWHERE.<br />
          <span className="text-zinc-500">FINDING ANSWERS SHOULDN'T BE.</span>
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8">
          
          {/* Scattered Knowledge */}
          <div className="flex flex-col items-center gap-6 w-48 relative">
            <div className="flex gap-2">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg rotate-[-12deg] shadow-lg"><File className="h-6 w-6 text-red-400" /></div>
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg rotate-[5deg] translate-y-3 shadow-lg"><FolderOpen className="h-6 w-6 text-blue-400" /></div>
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg rotate-[15deg] shadow-lg"><File className="h-6 w-6 text-emerald-400" /></div>
            </div>
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mt-2">Scattered Knowledge</div>
          </div>

          {/* Arrow */}
          <div className="text-zinc-700 hidden md:block"><ArrowRight className="h-6 w-6" /></div>
          <div className="text-zinc-700 md:hidden"><ArrowRight className="h-6 w-6 rotate-90" /></div>

          {/* Connected Platform */}
          <div className="flex flex-col items-center gap-6 w-48">
            <div className="h-20 w-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] ring-1 ring-white/20">
              <Command className="h-10 w-10 text-white" />
            </div>
            <div className="text-sm font-semibold text-white uppercase tracking-widest mt-2">KnowledgeHub</div>
          </div>

          {/* Arrow */}
          <div className="text-zinc-700 hidden md:block"><ArrowRight className="h-6 w-6" /></div>
          <div className="text-zinc-700 md:hidden"><ArrowRight className="h-6 w-6 rotate-90" /></div>

          {/* Outcome */}
          <div className="flex flex-col items-start gap-3 w-48 text-left bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-xl">
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-blue-500"></div> Ask</li>
              <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-blue-500"></div> Answer</li>
              <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-blue-500"></div> Verify</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. HOW IT WORKS
// ==========================================
const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-24 md:py-32 max-w-6xl mx-auto px-4 border-b border-zinc-900">
      <div className="mb-16 md:mb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
          FROM DOCUMENTS TO ANSWERS.
        </h2>
        <div className="h-1 w-12 bg-blue-600 rounded-full mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        
        {/* Step 1 */}
        <div className="flex flex-col h-full text-center md:text-left">
          <div className="text-5xl font-bold text-zinc-800 mb-6 font-mono tracking-tighter">01</div>
          <h4 className="text-xl font-bold text-white mb-3">Connect your knowledge</h4>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
            Upload PDFs, Word documents, text files, and Markdown. Build your secure knowledge base in seconds.
          </p>
          <div className="h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-center">
             <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950 border border-zinc-700/50 rounded-lg shadow-sm">
                <FolderOpen className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-zinc-300 font-medium">Drop documents here</span>
             </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col h-full text-center md:text-left">
          <div className="text-5xl font-bold text-zinc-800 mb-6 font-mono tracking-tighter">02</div>
          <h4 className="text-xl font-bold text-white mb-3">Ask naturally</h4>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
            Ask questions the exact same way you would ask a colleague. The AI understands nuance and context.
          </p>
          <div className="h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center gap-3">
             <div className="self-end px-3 py-2 bg-zinc-800 rounded-lg rounded-tr-sm text-xs text-zinc-300 shadow-sm text-left">
               Summarize the Q3 performance reports.
             </div>
             <div className="self-start px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg rounded-tl-sm text-xs text-zinc-400 flex items-center gap-2 shadow-sm">
               <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></div> Thinking...
             </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col h-full text-center md:text-left">
          <div className="text-5xl font-bold text-zinc-800 mb-6 font-mono tracking-tighter">03</div>
          <h4 className="text-xl font-bold text-white mb-3">Verify every answer</h4>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
            Explore inline citations. Click to view the exact paragraph in the original document the AI read.
          </p>
          <div className="h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-center">
             <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 w-full shadow-sm text-left">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Citation [1]</div>
                <div className="text-xs text-zinc-300 border-l-2 border-blue-500 pl-2 line-clamp-2">
                  "Q3 revenue grew by 24% year-over-year, driven primarily by enterprise software sales..."
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 6. SIGNATURE FEATURE (Sources & Citations)
// ==========================================
const VerificationDemo = () => {
  const [activeCitation, setActiveCitation] = useState<number | null>(null);

  return (
    <section id="sources" className="w-full py-16 md:py-20 max-w-6xl mx-auto px-4 relative">
      <div className="mb-8 md:mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
          AI ANSWERS YOU CAN VERIFY.
        </h2>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto md:mx-0">
          Don't just trust what AI says. See the information behind every important answer.
        </p>
      </div>

      <div className="flex flex-col md:flex-row rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl overflow-hidden relative">
        
        {/* Left: AI Answer */}
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-800">
          <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Bot className="h-4 w-4" /> AI Answer
          </div>
          <div className="text-lg md:text-xl text-zinc-200 leading-relaxed font-medium">
            The system extracts text from uploaded documents, chunks the content to preserve context, and stores high-dimensional vector embeddings in Qdrant for semantic retrieval. 
            
            <span 
              onMouseEnter={() => setActiveCitation(1)}
              onMouseLeave={() => setActiveCitation(null)}
              className={`inline-flex items-center justify-center ml-2 mr-1 w-6 h-6 rounded text-xs font-mono border cursor-pointer transition-all duration-300 relative -top-0.5
                ${activeCitation === 1 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'}
              `}
            >
              1
            </span>
            <span 
              onMouseEnter={() => setActiveCitation(2)}
              onMouseLeave={() => setActiveCitation(null)}
              className={`inline-flex items-center justify-center ml-1 w-6 h-6 rounded text-xs font-mono border cursor-pointer transition-all duration-300 relative -top-0.5
                ${activeCitation === 2 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'}
              `}
            >
              2
            </span>
          </div>
          <p className="mt-8 text-xs text-zinc-500 border-t border-zinc-800/50 pt-4">
            Every citation connects you directly to the original source document. Hover over a number to instantly view the context.
          </p>
        </div>

        {/* Right: Sources Panel */}
        <div className="w-full md:w-[450px] bg-zinc-950 p-6 md:p-8 flex flex-col gap-4">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Database className="h-4 w-4" /> Source View
          </div>

          {/* Source 1 */}
          <div className={`rounded-xl p-4 border transition-all duration-300 relative ${activeCitation === 1 ? 'bg-zinc-900 border-blue-500/50 shadow-[0_0_30px_-10px_rgba(37,99,235,0.15)] scale-[1.02] ring-1 ring-blue-500/20' : 'bg-zinc-900/50 border-zinc-800 opacity-60 grayscale scale-100'}`}>
            <div className="flex items-start gap-3 mb-2">
              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded text-[10px] font-mono flex items-center justify-center transition-colors border ${activeCitation === 1 ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>1</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200"><File className="h-3.5 w-3.5 text-blue-500" /> <span className="truncate">Data_Processing.pdf</span></div>
                <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider font-semibold">Ingestion Pipeline</div>
                <div className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed border-l-2 border-zinc-800 pl-2">
                  "...uploaded files are <span className={activeCitation === 1 ? "bg-blue-900/40 text-blue-200 rounded-sm px-0.5" : ""}>parsed into semantic chunks and converted into vector embeddings</span> using the embedding model before being indexed..."
                </div>
              </div>
            </div>
          </div>

          {/* Source 2 */}
          <div className={`rounded-xl p-4 border transition-all duration-300 relative ${activeCitation === 2 ? 'bg-zinc-900 border-emerald-500/50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)] scale-[1.02] ring-1 ring-emerald-500/20' : 'bg-zinc-900/50 border-zinc-800 opacity-60 grayscale scale-100'}`}>
            <div className="flex items-start gap-3 mb-2">
              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded text-[10px] font-mono flex items-center justify-center transition-colors border ${activeCitation === 2 ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>2</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200"><File className="h-3.5 w-3.5 text-emerald-500" /> <span className="truncate">Vector_Storage.md</span></div>
                <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider font-semibold">Semantic Retrieval</div>
                <div className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed border-l-2 border-zinc-800 pl-2">
                  "...we rely on <span className={activeCitation === 2 ? "bg-emerald-900/40 text-emerald-200 rounded-sm px-0.5" : ""}>Qdrant as our primary vector database to efficiently search and retrieve these embeddings</span> during the RAG workflow..."
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ==========================================
// 7. PRODUCT CAPABILITIES
// ==========================================
const Capabilities = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-zinc-900/30 border-y border-zinc-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-12 md:gap-y-24">
          
          <div>
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 shadow-md shadow-zinc-950">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Find what matters</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Search across your knowledge using natural language and semantic understanding. Find what you mean, not just what you type.
            </p>
          </div>

          <div>
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 shadow-md shadow-zinc-950">
              <LinkIcon className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Answers with evidence</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              See supporting citations and understand exactly where important information comes from, eliminating AI hallucinations.
            </p>
          </div>

          <div>
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 shadow-md shadow-zinc-950">
              <Network className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Knowledge that stays connected</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Turn scattered documents into one searchable knowledge workspace. Upload files once, query them forever in organized sessions.
            </p>
          </div>

          <div>
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 shadow-md shadow-zinc-950">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Built for serious work</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Create an organized environment for working with documents. Private workspaces and secure storage ensure your knowledge remains yours.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

// ==========================================
// 8. USE CASES (Tabbed interface)
// ==========================================
const UseCases = () => {
  const [activeTab, setActiveTab] = useState('engineering');

  const content = {
    engineering: {
      title: 'Engineering',
      desc: 'Search architecture, APIs, implementation notes, and technical documentation.',
      question: 'How do we handle API rate limits?',
      answer: 'The system uses a token bucket algorithm implemented in middleware, limiting authenticated requests to 100 per minute per user ID.'
    },
    product: {
      title: 'Product',
      desc: 'Ask questions across requirements, specifications, and product knowledge.',
      question: 'What was the rationale for dropping the export feature?',
      answer: 'Based on Q2 user research, only 2% of users exported data. The team decided to focus resources on the direct sharing link feature instead.'
    },
    operations: {
      title: 'Operations',
      desc: 'Find information across internal documents, processes, and organizational knowledge.',
      question: 'What is the policy for international remote work?',
      answer: 'Employees may work internationally for up to 30 days per calendar year, requiring manager approval at least two weeks in advance.'
    },
    personal: {
      title: 'Personal Knowledge',
      desc: 'Organize important documents and make them easier to search and understand.',
      question: 'What were the key takeaways from the Stanford AI paper?',
      answer: 'The paper highlighted three main points: 1) Model size does not linearly correlate with reasoning ability, 2) Data quality is paramount, and 3) Retrieval systems mitigate hallucinations.'
    }
  };

  return (
    <section id="use-cases" className="w-full py-24 md:py-32 border-b border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-12 text-center uppercase">
          BUILT FOR THE WAY KNOWLEDGE IS ACTUALLY USED.
        </h2>
        
        {/* Selector */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-zinc-950 border border-zinc-800 rounded-full mb-12 shadow-inner">
          {Object.keys(content).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === key ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {content[key as keyof typeof content].title}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="w-full flex flex-col md:flex-row gap-8 items-stretch rounded-2xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden shadow-2xl">
          <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {content[activeTab as keyof typeof content].title}
            </h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              {content[activeTab as keyof typeof content].desc}
            </p>
          </div>
          <div className="flex-[1.5] bg-zinc-950 p-8 flex flex-col gap-6 justify-center">
            <div className="flex gap-4 items-start">
              <div className="mt-1 h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700"><User className="h-3 w-3 text-zinc-400"/></div>
              <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-zinc-200">
                {content[activeTab as keyof typeof content].question}
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="mt-1 h-6 w-6 rounded-md bg-blue-900/30 border border-blue-800/30 flex items-center justify-center shrink-0"><Bot className="h-3 w-3 text-blue-400"/></div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-zinc-400 leading-relaxed">
                {content[activeTab as keyof typeof content].answer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 9. PRODUCT DIRECTION
// ==========================================
const ProductDirection = () => {
  return (
    <section className="w-full py-32 max-w-5xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-6 uppercase">
        BUILT TO GROW WITH YOUR KNOWLEDGE.
      </h2>
      <p className="text-base md:text-lg text-zinc-400 mb-16 max-w-2xl mx-auto">
        KnowledgeHub is designed to evolve from document retrieval into a more complete intelligent knowledge workspace. Features currently in development include:
      </p>
      
      <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-8 text-left">
        <div className="flex-1 border-l-2 border-zinc-800 pl-6">
          <div className="h-8 w-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4"><Workflow className="h-4 w-4 text-zinc-400"/></div>
          <h4 className="text-zinc-200 font-bold mb-2">AI Workflows</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">Knowledge-driven automation and task assistance.</p>
        </div>
        <div className="flex-1 border-l-2 border-zinc-800 pl-6">
          <div className="h-8 w-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4"><Layers className="h-4 w-4 text-zinc-400"/></div>
          <h4 className="text-zinc-200 font-bold mb-2">Unified Knowledge</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">Bring different enterprise knowledge sources together.</p>
        </div>
        <div className="flex-1 border-l-2 border-zinc-800 pl-6">
          <div className="h-8 w-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4"><Lightbulb className="h-4 w-4 text-zinc-400"/></div>
          <h4 className="text-zinc-200 font-bold mb-2">Advanced Reasoning</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">Help users explore and understand complex information across documents.</p>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 10. TECHNOLOGY FOUNDATION
// ==========================================
const TechnologyFoundation = () => {
  return (
    <section className="w-full py-20 bg-zinc-950 border-y border-zinc-900 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-blue-900/10 blur-[100px] pointer-events-none rounded-full"></div>
      
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-12 text-center relative z-10">
        POWERED BY A MODERN AI & KNOWLEDGE STACK
      </p>
      
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 max-w-5xl mx-auto px-4 relative z-10">
        
        {/* Next.js */}
        <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-default">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM15.8239 15.845L15.8239 8.24584H17.2602L17.2602 15.845H15.8239ZM8.9749 15.845H7.58557V8.24584H8.81424L14.7335 15.845H8.9749Z"/>
          </svg>
          <span className="text-zinc-400 font-medium text-sm group-hover:text-zinc-200 transition-colors">Next.js</span>
        </div>

        {/* MongoDB */}
        <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-default">
          <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.213 14.525C20.61 20.301 13.914 24 12.016 24 10.117 24 2.85 20.046 2.85 11.233c0-7.398 6.784-10.748 8.653-11.215.114-.029.231-.016.335.035.105.05.188.134.237.238 2.052 4.318 8.621 11.385 9.138 14.234zM12 1.341C10.75 1.83 6.643 3.655 6.643 11.233c0 7.218 5.764 9.123 5.357 11.666 0 0 6.643-4.595 6.643-11.666 0-3.323-2.188-7.348-6.643-9.892z"/>
          </svg>
          <span className="text-zinc-400 font-medium text-sm group-hover:text-zinc-200 transition-colors">MongoDB</span>
        </div>

        {/* Qdrant */}
        <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-default">
          <Network className="h-5 w-5 text-red-500" />
          <span className="text-zinc-400 font-medium text-sm group-hover:text-zinc-200 transition-colors">Qdrant Vector DB</span>
        </div>

        {/* Hugging Face */}
        <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-default">
          <div className="text-yellow-500 text-lg">🤗</div>
          <span className="text-zinc-400 font-medium text-sm group-hover:text-zinc-200 transition-colors">Hugging Face</span>
        </div>

        {/* TypeScript */}
        <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-default">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM13.435 11.837h2.72v-2.04h-7.04v2.04h2.16v8.4h2.16v-8.4zm2.146.524c1.867 0 3.32.748 4.254 2.124l-1.636 1.155c-.534-.84-1.282-1.32-2.39-1.32-1.11 0-1.87.525-1.87 1.258 0 .61.436.936 1.704 1.28l.848.232c2.146.594 3.514 1.545 3.514 3.498 0 2.215-1.785 3.696-4.527 3.696-2.31 0-4.047-1.02-4.992-2.434l1.696-1.168c.677 1.05 1.623 1.636 3.125 1.636 1.346 0 2.115-.558 2.115-1.353 0-.663-.497-.98-1.805-1.34l-.865-.245c-1.884-.525-3.41-1.467-3.41-3.512 0-2.062 1.678-3.5 4.312-3.5z"/>
          </svg>
          <span className="text-zinc-400 font-medium text-sm group-hover:text-zinc-200 transition-colors">TypeScript</span>
        </div>

        {/* Tailwind */}
        <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-default">
          <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
          </svg>
          <span className="text-zinc-400 font-medium text-sm group-hover:text-zinc-200 transition-colors">Tailwind CSS</span>
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 11. FINAL CTA
// ==========================================
const FinalCTA = () => {
  return (
    <section className="w-full py-32 md:py-40 bg-zinc-950 relative overflow-hidden flex flex-col items-center text-center px-4">
      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
          STOP SEARCHING.<br />START ASKING.
        </h2>
        <p className="text-base md:text-xl text-zinc-400 px-4 max-w-xl mx-auto">
          Turn your documents into an intelligent knowledge workspace with answers backed by sources you can verify.
        </p>
        <div className="pt-4">
          <Link href="/register">
            <Button className="h-12 md:h-14 px-8 md:px-10 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-sm md:text-base font-semibold transition-colors cursor-pointer">
              Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MAIN PAGE COMPONENT & 12. FOOTER
// ==========================================
export default function Home() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Update URL without jumping
          window.history.pushState(null, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-zinc-950 text-zinc-50 selection:bg-blue-900/50 overflow-x-hidden">
      <Header />
      
      <main className="flex-1 w-full relative z-10">
        <Hero />
        <ProductExperience />
        <ProblemTransformation />
        <HowItWorks />
        <VerificationDemo />
        <Capabilities />
        <UseCases />
        <ProductDirection />
        <TechnologyFoundation />
        <FinalCTA />
      </main>
      
      {/* 12. FOOTER */}
      <footer className="w-full pt-16 pb-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white transition-colors">
                  <Command className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-zinc-200">KnowledgeHub AI</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                An intelligent knowledge workspace for asking better questions and finding answers backed by real sources.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-12 md:gap-24">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Links</span>
                <Link href="#product" className="text-sm text-zinc-500 hover:text-white transition-colors">Product</Link>
                <Link href="#how-it-works" className="text-sm text-zinc-500 hover:text-white transition-colors">How it works</Link>
                <Link href="#sources" className="text-sm text-zinc-500 hover:text-white transition-colors">Sources</Link>
                <Link href="#use-cases" className="text-sm text-zinc-500 hover:text-white transition-colors">Use Cases</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Account</span>
                <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">Sign In</Link>
                <Link href="/register" className="text-sm text-zinc-500 hover:text-white transition-colors">Register</Link>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8 border-t border-zinc-900/60 w-full mt-4">
            <p className="text-xs md:text-sm text-zinc-500 tracking-wide font-medium">
              © {new Date().getFullYear()} KnowledgeHub AI. <span className="text-zinc-600">All rights reserved.</span>
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
