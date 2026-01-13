
import React from 'react';
import { WorkflowStep } from '../types';

interface ExecutionTrackerProps {
  steps: WorkflowStep[];
}

const ExecutionTracker: React.FC<ExecutionTrackerProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Active Execution Logs
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start group">
            <div className="relative flex flex-col items-center mr-4">
              <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                step.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' :
                step.status === 'running' ? 'bg-indigo-100 border-indigo-500 text-indigo-600 animate-pulse' :
                'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                {step.status === 'completed' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              {idx !== steps.length - 1 && (
                <div className={`w-0.5 h-full absolute top-8 transition-colors ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
            <div className="pb-8">
              <h4 className={`font-semibold transition-colors ${
                step.status === 'completed' ? 'text-slate-800' :
                step.status === 'running' ? 'text-indigo-600' : 'text-slate-400'
              }`}>
                {step.label}
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                {step.status === 'running' ? 'In progress...' : 
                 step.status === 'completed' ? 'Finished successfully.' : 
                 'Awaiting activation.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionTracker;
