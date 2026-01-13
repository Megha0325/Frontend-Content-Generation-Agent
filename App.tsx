
import React, { useState, useCallback, useEffect } from 'react';
import { AppStatus, WorkflowConfig, WorkflowStep, GenerationResult } from './types';
import WorkflowForm from './components/WorkflowForm';
import ExecutionTracker from './components/ExecutionTracker';
import ResultView from './components/ResultView';
import { generateWorkflowContent } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [activeSteps, setActiveSteps] = useState<WorkflowStep[]>([]);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null);

  const initialSteps: WorkflowStep[] = [
    { id: '1', label: 'Inbound Request Validation', status: 'idle' },
    { id: '2', label: 'Semantic Research & Topic Discovery', status: 'idle' },
    { id: '3', label: 'Contextual Text Synthesis', status: 'idle' },
    { id: '4', label: 'AI Visual Assets Generation', status: 'idle' },
    { id: '5', label: 'Sentiment & SEO Optimization Check', status: 'idle' }
  ];

  const runWorkflow = async (config: WorkflowConfig) => {
    setStatus(AppStatus.EXECUTING);
    setSelectedResult(null);
    const steps = [...initialSteps];
    setActiveSteps(steps);

    // Simulated step execution for visual feedback
    for (let i = 0; i < steps.length; i++) {
      steps[i] = { ...steps[i], status: 'running' };
      setActiveSteps([...steps]);
      
      // Delay to simulate n8n processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      steps[i] = { ...steps[i], status: 'completed' };
      setActiveSteps([...steps]);
    }

    try {
      const result = await generateWorkflowContent(config);
      setHistory(prev => [result, ...prev]);
      setSelectedResult(result);
      setStatus(AppStatus.VIEWING);
    } catch (error) {
      console.error("Workflow failed", error);
      setStatus(AppStatus.IDLE);
      alert("Automation failed. Please check your API key.");
    }
  };

  const handleSelectHistory = (result: GenerationResult) => {
    setSelectedResult(result);
    setStatus(AppStatus.VIEWING);
  };

  // Helper function to resolve the header title based on current AppStatus
  // This avoids inline narrowing errors in the JSX template.
  const renderHeaderTitle = () => {
    switch (status) {
      case AppStatus.IDLE:
        return 'Dashboard';
      case AppStatus.EXECUTING:
        return 'Executing Workflow...';
      case AppStatus.VIEWING:
        return 'Generation Result';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
            F
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">FlowForge</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Recent Automations
          </div>
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No executions yet.
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectHistory(item)}
                className={`w-full p-4 rounded-xl text-left transition-all group ${
                  selectedResult?.id === item.id 
                    ? 'bg-indigo-50 border-indigo-100 ring-1 ring-indigo-200' 
                    : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600">
                  {item.config.topic}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(item.timestamp).toLocaleDateString()} • {item.config.contentType}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">Automation Admin</p>
              <p className="text-[10px] text-slate-500 uppercase font-medium">Pro Plan active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => { setStatus(AppStatus.IDLE); setSelectedResult(null); }}
              className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${status === AppStatus.IDLE ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              {renderHeaderTitle()}
            </h1>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              N8N Connection Live
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {status === AppStatus.IDLE && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <div className="mb-8">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Generate Brilliance.</h2>
                  <p className="text-slate-500 text-lg mt-3 leading-relaxed">
                    Configure your parameters and trigger the multi-agent automation workflow. 
                    FlowForge orchestrates research, visual creation, and content synthesis.
                  </p>
                </div>
                {/* Fixed TS error: status is narrowed to AppStatus.IDLE here, so isLoading is always false */}
                <WorkflowForm onSubmit={runWorkflow} isLoading={false} />
              </div>
              
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-2xl shadow-indigo-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold">Quick Insights</h3>
                    <p className="text-indigo-100 mt-2 text-sm opacity-90">Your automation efficiency is up by 12% this week.</p>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur p-4 rounded-2xl">
                        <span className="block text-2xl font-bold">142</span>
                        <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest">Words Generated</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur p-4 rounded-2xl">
                        <span className="block text-2xl font-bold">24</span>
                        <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest">Images Created</span>
                      </div>
                    </div>
                  </div>
                  {/* Decorative Blob */}
                  <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                   <h4 className="font-bold text-slate-800 mb-4">Integrations</h4>
                   <div className="flex space-x-4">
                     <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center p-2 border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-pointer">
                       <img src="https://picsum.photos/seed/n8n/40/40" alt="n8n" className="rounded opacity-60" />
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center p-2 border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-pointer">
                       <img src="https://picsum.photos/seed/slack/40/40" alt="slack" className="rounded opacity-60" />
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center p-2 border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-pointer">
                       <img src="https://picsum.photos/seed/github/40/40" alt="github" className="rounded opacity-60" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {status === AppStatus.EXECUTING && (
            <div className="max-w-2xl mx-auto py-12">
               <div className="text-center mb-10">
                 <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                   <svg className="w-12 h-12 text-indigo-600 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900">Synchronizing Workflow...</h2>
                 <p className="text-slate-500 mt-2">Connecting to N8N nodes and executing Gemini-powered content blocks.</p>
               </div>
               <ExecutionTracker steps={activeSteps} />
            </div>
          )}

          {status === AppStatus.VIEWING && selectedResult && (
            <ResultView 
              result={selectedResult} 
              onClose={() => { setStatus(AppStatus.IDLE); setSelectedResult(null); }} 
            />
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
