
import React from 'react';
import { WorkflowStep } from '../types';

interface ExecutionTrackerProps {
  steps: WorkflowStep[];
}

const ExecutionTracker: React.FC<ExecutionTrackerProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#0a5cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Handoff Sequence
        </h3>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <div className="w-1.5 h-1.5 bg-[#0a5cff] rounded-full animate-pulse" />
        </div>
      </div>
      <div className="p-8 space-y-6">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start group">
            <div className="relative flex flex-col items-center mr-6">
              <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                step.status === 'completed' ? 'bg-green-50 border-green-500 text-green-600 scale-100' :
                step.status === 'running' ? 'bg-[#0a5cff] border-[#0a5cff] text-white shadow-lg shadow-[#0a5cff]/30 scale-110' :
                'bg-slate-50 border-slate-100 text-slate-300 scale-90'
              }`}>
                {step.status === 'completed' ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                ) : (
                  <span className="text-sm font-black">{idx + 1}</span>
                )}
              </div>
              {idx !== steps.length - 1 && (
                <div className={`w-0.5 h-full absolute top-10 transition-all duration-700 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-slate-100'
                }`} />
              )}
            </div>
            <div className="pb-6">
              <h4 className={`text-lg font-bold transition-colors duration-300 ${
                step.status === 'completed' ? 'text-slate-800' :
                step.status === 'running' ? 'text-[#0a5cff]' : 'text-slate-300'
              }`}>
                {step.label}
              </h4>
              <p className={`text-sm mt-1 font-medium ${
                step.status === 'running' ? 'text-slate-600 animate-pulse' : 'text-slate-400'
              }`}>
                {step.status === 'running' ? 'Connecting to node...' : 
                 step.status === 'completed' ? 'Bridge verified.' : 
                 'Queued for transmission.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionTracker;
