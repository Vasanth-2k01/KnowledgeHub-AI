import { Command, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-50 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 dark:bg-zinc-950">
      {/* Left Section - Hidden on Mobile/Tablet */}
      <div className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white lg:flex">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-zinc-950 to-zinc-950" />
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
        
        {/* Logo and Brand */}
        <Link href="/" className="relative z-20 flex items-center gap-2 text-lg font-medium text-zinc-100 hover:opacity-90 transition-opacity w-fit">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-900/50">
            <Command className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-xl">KnowledgeHub AI</span>
        </Link>
        
        {/* Content */}
        <div className="relative z-20 mt-auto mb-10">
          <div className="space-y-6 max-w-lg">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
              Your intelligent knowledge workspace.
            </h1>
            <p className="text-lg leading-relaxed text-zinc-400">
              Transform how your team stores, searches, and interacts with internal documentation using advanced AI and semantic search.
            </p>
            
            <div className="pt-6 space-y-4">
              {[
                'AI Powered Semantic Search',
                'Secure Authentication',
                'Chat with Documents',
                'Team Collaboration',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                  <span className="font-medium text-zinc-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section - Auth Form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 slide-in-from-bottom-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}
