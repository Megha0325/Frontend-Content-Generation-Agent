
import React from 'react';
import { ContentType } from '../types';

interface LandingPageProps {
  onSelectAgent: (types: ContentType[]) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectAgent }) => {
  const agents = [
    {
      id: 'social',
      title: 'Social Media Content Creation Agent',
      description: 'Orchestrate high-engagement posts across LinkedIn, Facebook, Instagram, and Twitter.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      types: ['EXAIR - LinkedIn', 'EXAIR Corporation - Facebook', 'exair_corporation - Instagram', 'EXAIR - Twitter'] as ContentType[]
    },
    {
      id: 'blog',
      title: 'Blog Post Creation Agent',
      description: 'Generate deep-dive, long-form articles optimized for technical readers and SEO ranking.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4v4h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h3m-3 4h10m-10 4h10" />
        </svg>
      ),
      types: ['Blog Post'] as ContentType[]
    },
    {
      id: 'email',
      title: 'Email Newsletters Creation Agent',
      description: 'Craft compelling direct-mail campaigns and technical update newsletters.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      types: ['Email News Letter'] as ContentType[]
    }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Choose Your Agent</h2>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto">
          Select a specialized automation agent to begin your content orchestration workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl items-stretch">
        {agents.map((agent, index) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.types)}
            className="group relative bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-[#0a5cff]/10 hover:-translate-y-2 transition-all text-left animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both flex flex-col h-full"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0a5cff] mb-8 group-hover:bg-[#0a5cff] group-hover:text-white transition-all duration-300 flex-shrink-0">
              {agent.icon}
            </div>
            
            <div className="flex-grow flex flex-col">
              {/* Added a fixed min-height to the title container to align the descriptions below it */}
              <div className="min-h-[4rem] flex items-center mb-4">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#0a5cff] transition-colors line-clamp-2">
                  {agent.title}
                </h3>
              </div>
              
              {/* Ensure the description box takes up the remaining middle space */}
              <div className="flex-grow">
                <p className="text-slate-500 leading-relaxed mb-8">
                  {agent.description}
                </p>
              </div>
            </div>

            {/* Footer remains at the bottom of the card due to h-full on parent and flex-grow on middle content */}
            <div className="flex items-center text-[#0a5cff] font-bold mt-auto pt-6 border-t border-slate-50 flex-shrink-0">
              <span>Initialize Workflow</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
               <div className="w-24 h-24 bg-[#0a5cff] rounded-full blur-3xl" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
