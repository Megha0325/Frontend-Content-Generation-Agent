
import React, { useState } from 'react';
import { AppStatus, WorkflowConfig, WorkflowStep, GenerationResult, ContentType } from './types';
import LandingPage from './components/LandingPage';
import WorkflowForm from './components/WorkflowForm';
import ExecutionTracker from './components/ExecutionTracker';
import ResultView from './components/ResultView';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import { triggerN8NWorkflow, getRedirectUrl, sendVerificationEmail } from './services/n8nService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.LOGIN);
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedAgentTypes, setSelectedAgentTypes] = useState<ContentType[]>([]);
  const [activeSteps, setActiveSteps] = useState<WorkflowStep[]>([]);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null);

  const handoffSteps: WorkflowStep[] = [
    { id: '1', label: 'Packaging Payload', status: 'idle' },
    { id: '2', label: 'Establishing Bridge to N8N', status: 'idle' },
    { id: '3', label: 'Triggering Webhook Listener', status: 'idle' },
    { id: '4', label: 'Handoff Confirmed', status: 'idle' },
    { id: '5', label: 'Processing at Destination', status: 'idle' }
  ];

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setStatus(AppStatus.LANDING);
  };
  
  const handleSignUp = async (email: string) => { 
    setUserEmail(email); 
    setStatus(AppStatus.VERIFY_EMAIL);
    // Trigger real verification email via N8N
    await sendVerificationEmail(email);
  };

  const handleResendEmail = async () => {
    if (userEmail) {
      await sendVerificationEmail(userEmail);
    }
  };

  const handleEmailVerified = () => setStatus(AppStatus.LANDING);

  const handleSelectAgent = (types: ContentType[]) => {
    setSelectedAgentTypes(types);
    setStatus(AppStatus.IDLE);
  };

  const runWorkflow = async (config: WorkflowConfig) => {
    setStatus(AppStatus.EXECUTING);
    const steps = [...handoffSteps];
    setActiveSteps(steps);

    steps[0] = { ...steps[0], status: 'running' };
    setActiveSteps([...steps]);
    await new Promise(r => setTimeout(r, 600));
    steps[0] = { ...steps[0], status: 'completed' };

    steps[1] = { ...steps[1], status: 'running' };
    setActiveSteps([...steps]);
    await new Promise(r => setTimeout(r, 800));
    steps[1] = { ...steps[1], status: 'completed' };

    steps[2] = { ...steps[2], status: 'running' };
    setActiveSteps([...steps]);
    
    // Ensure the payload is sent with the targetEmail from the form
    const result = await triggerN8NWorkflow(config);
    
    if (result.success) {
      steps[2] = { ...steps[2], status: 'completed' };
      steps[3] = { ...steps[3], status: 'running' };
      setActiveSteps([...steps]);
      await new Promise(r => setTimeout(r, 800));
      steps[3] = { ...steps[3], status: 'completed' };

      steps[4] = { ...steps[4], status: 'running' };
      setActiveSteps([...steps]);
      await new Promise(r => setTimeout(r, 1000));
      steps[4] = { ...steps[4], status: 'completed' };

      setStatus(AppStatus.COMPLETED);
    } else {
      steps[2] = { ...steps[2], status: 'failed' };
      setActiveSteps([...steps]);
      setTimeout(() => {
        alert(`N8N Workflow Error: ${result.error || "The remote server returned an internal error."}`);
        setStatus(AppStatus.IDLE);
      }, 500);
    }
  };

  const handleSelectHistory = (result: GenerationResult) => {
    setSelectedResult(result);
    setStatus(AppStatus.VIEWING);
  };

  const renderHeaderTitle = () => {
    switch (status) {
      case AppStatus.LANDING: return 'Selection Hub';
      case AppStatus.IDLE:
        if (selectedAgentTypes.includes('Blog Post') && selectedAgentTypes.length === 1) return 'Blog Creation Page';
        if (selectedAgentTypes.some(t => t.includes('EXAIR'))) return 'Social Media Orchestration';
        if (selectedAgentTypes.includes('Email News Letter')) return 'Email Campaign Builder';
        return 'Dashboard';
      case AppStatus.EXECUTING: return 'N8N Cloud Handoff';
      case AppStatus.VIEWING: return 'Generation Result';
      case AppStatus.COMPLETED: return 'Status Report';
      default: return '';
    }
  };

  const getMainOrchestrationTitle = () => {
    if (selectedAgentTypes.includes('Blog Post')) return 'Blog Post Orchestrator';
    if (selectedAgentTypes.some(t => t.includes('EXAIR'))) return 'Social Media Orchestration';
    return 'K&J Cloud Orchestrator';
  };

  const getMainOrchestrationSubtitle = () => {
    if (selectedAgentTypes.includes('Blog Post')) return 'SEO-optimized articles for technical readers';
    if (selectedAgentTypes.some(t => t.includes('EXAIR'))) return 'Posts for LinkedIn, Facebook, Instagram, Twitter';
    return `Configuring ${selectedAgentTypes.join(', ')} payload for transmission.`;
  };

  if (status === AppStatus.LOGIN) return <LoginPage onLogin={handleLogin} onGoToSignUp={() => setStatus(AppStatus.SIGNUP)} />;
  if (status === AppStatus.SIGNUP) return <SignUpPage onSignUp={handleSignUp} onGoToLogin={() => setStatus(AppStatus.LOGIN)} />;
  if (status === AppStatus.VERIFY_EMAIL) return <VerifyEmailPage email={userEmail} onVerified={handleEmailVerified} onResend={handleResendEmail} />;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 animate-in fade-in duration-1000">
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0a5cff] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#0a5cff]/20">F</div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">FlowForge</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-widest">System Logs</div>
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm italic">Logs will appear after N8N callback.</div>
          ) : (
            history.map((item) => (
              <button key={item.id} onClick={() => handleSelectHistory(item)} className="w-full p-4 rounded-xl text-left hover:bg-slate-50 border-transparent">
                <div className="text-sm font-bold line-clamp-1">{item.config.topic}</div>
                <div className="text-xs text-slate-500 mt-1">{new Date(item.timestamp).toLocaleDateString()}</div>
              </button>
            ))
          )}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a5cff] to-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate" title={userEmail}>{userEmail || 'Guest User'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-medium">Cloud Bridge Active</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setStatus(AppStatus.LANDING)} className="p-2 rounded-xl text-[#0a5cff] bg-[#0a5cff]/5 hover:bg-[#0a5cff]/10 ring-1 ring-[#0a5cff]/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800">{renderHeaderTitle()}</h1>
          </div>
          <button onClick={() => setStatus(AppStatus.LOGIN)} className="px-4 py-2 bg-white text-[#0a5cff] hover:bg-[#0a5cff]/5 border border-[#0a5cff]/20 rounded-xl text-xs font-bold transition-all">Logout</button>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {status === AppStatus.LANDING && <LandingPage onSelectAgent={handleSelectAgent} />}
          {status === AppStatus.IDLE && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{getMainOrchestrationTitle()}</h2>
                <p className="text-slate-500 text-lg mt-4 leading-relaxed max-w-2xl mx-auto">
                  {getMainOrchestrationSubtitle()}
                </p>
              </div>
              <WorkflowForm 
                onSubmit={runWorkflow} 
                isLoading={false} 
                initialContentTypes={selectedAgentTypes} 
                userEmail={userEmail}
              />
            </div>
          )}

          {status === AppStatus.EXECUTING && (
            <div className="max-w-2xl mx-auto py-12 animate-in zoom-in duration-500">
               <div className="text-center mb-10">
                 <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-[#0a5cff] rounded-full blur-xl opacity-20 animate-pulse" />
                    <div className="relative p-6 bg-blue-50 rounded-full border border-blue-100">
                      <svg className="w-16 h-16 text-[#0a5cff] animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900">Synchronizing with N8N Cloud</h2>
                 <p className="text-slate-500 mt-2 font-medium">Connecting to your KandJTech endpoint...</p>
               </div>
               <ExecutionTracker steps={activeSteps} />
               <div className="mt-12 p-4 bg-slate-900 rounded-2xl flex items-center justify-between border border-slate-800 shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-xs font-mono text-slate-400">ENDPOINT: kandjtech.app.n8n.cloud</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">REST Protocol Secure</span>
               </div>
            </div>
          )}

          {status === AppStatus.COMPLETED && (
            <div className="max-w-2xl mx-auto py-12 text-center animate-in zoom-in duration-700">
               <div className="mb-8">
                  <div className="w-24 h-24 bg-green-50 rounded-full border-4 border-green-500 flex items-center justify-center text-green-500 mx-auto shadow-xl shadow-green-100">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
               </div>
               <h2 className="text-4xl font-black text-slate-900 mb-4">Task Completed Successfully</h2>
               <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
                 The content orchestration payload has been successfully received by the N8N production engine for <strong>{userEmail}</strong>. 
                 Your assets are now being generated in the cloud.
               </p>
               
               <div className="flex items-center justify-center">
                 <button 
                   onClick={() => setStatus(AppStatus.LANDING)}
                   className="px-10 py-4 bg-[#0a5cff] text-white font-bold rounded-2xl shadow-lg shadow-[#0a5cff]/20 hover:bg-[#0048d9] transition-all flex items-center group active:scale-95"
                 >
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                   </svg>
                   Home
                 </button>
               </div>
            </div>
          )}

          {status === AppStatus.VIEWING && selectedResult && (
            <ResultView result={selectedResult} onClose={() => setStatus(AppStatus.IDLE)} />
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
