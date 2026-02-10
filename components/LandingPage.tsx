
import React from 'react';
import { ContentType } from '../types';

interface LandingPageProps {
  onSelectAgent: (types: ContentType[]) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectAgent }) => {
  const agents = [
    {
      id: 'social',
      title: 'Social Media',
      description: 'Posts for LinkedIn, Facebook, Instagram, Twitter.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      types: ['EXAIR - LinkedIn', 'EXAIR Corporation - Facebook', 'exair_corporation - Instagram', 'EXAIR - Twitter'] as ContentType[]
    },
    {
      id: 'blog',
      title: 'Blog Post',
      description: 'SEO-optimized articles for technical readers.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4v4h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h3m-3 4h10m-10 4h10" />
        </svg>
      ),
      types: ['Blog Post'] as ContentType[]
    },
    {
      id: 'email',
      title: 'Email Newsletter',
      description: 'Technical update newsletters & campaigns.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      types: ['Email News Letter'] as ContentType[]
    }
  ];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Select Workflow Agent</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Choose a specialized orchestration engine to begin.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl items-center justify-center">
        {agents.map((agent, index) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.types)}
            className="group relative flex flex-row items-center w-full lg:flex-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-[#0a5cff]/10 hover:-translate-y-1 transition-all text-left animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 bg-[#0a5cff]/5 rounded-xl flex items-center justify-center text-[#0a5cff] mr-5 group-hover:bg-[#0a5cff] group-hover:text-white transition-all duration-300 flex-shrink-0 shadow-sm">
              {agent.icon}
            </div>
            
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0a5cff] transition-colors truncate">
                {agent.title}
              </h3>
              <p className="text-slate-500 text-xs leading-tight mt-1 line-clamp-2">
                {agent.description}
              </p>
            </div>

            <div className="flex-shrink-0 text-[#0a5cff] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
               <div className="w-16 h-16 bg-[#0a5cff] rounded-full blur-2xl" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
