
import React from 'react';
import { GenerationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultViewProps {
  result: GenerationResult;
  onClose: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onClose }) => {
  const chartData = [
    { name: 'Reading Time (min)', value: result.metrics.readingTime },
    { name: 'Keyword Density', value: result.metrics.keywordDensity * 10 },
    { name: 'Sentiment Score', value: 85 }, // Simulated
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">{result.config.topic}</h2>
          <p className="text-slate-500 mt-1">Generated {new Date(result.timestamp).toLocaleString()}</p>
        </div>
        <button 
          onClick={onClose}
          className="px-5 py-2.5 bg-[#0a5cff]/5 text-[#0a5cff] hover:bg-[#0a5cff]/10 border border-[#0a5cff]/20 rounded-xl font-bold flex items-center transition-all active:scale-95 shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {result.imageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img src={result.imageUrl} alt="AI Visual" className="w-full h-[400px] object-cover" />
            </div>
          )}
          
          <div className="prose prose-slate max-w-none bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
             <div className="whitespace-pre-wrap text-slate-800 text-lg leading-relaxed">
               {result.text}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0a5cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Content Analytics
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#0a5cff' : index === 1 ? '#8b5cf6' : '#ec4899'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div className="p-3 bg-blue-50 rounded-xl">
                 <p className="text-xs text-[#0a5cff] font-bold uppercase">Sentiment</p>
                 <p className="text-lg font-bold text-blue-900">{result.metrics.sentiment}</p>
               </div>
               <div className="p-3 bg-purple-50 rounded-xl">
                 <p className="text-xs text-purple-600 font-bold uppercase">Reading Time</p>
                 <p className="text-lg font-bold text-purple-900">{result.metrics.readingTime}m</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 text-white">Workflow Metadata</h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col space-y-1">
                <span className="text-slate-400">Content Type(s)</span>
                <div className="flex flex-wrap gap-1">
                  {result.config.contentType.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-mono border border-slate-700">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-slate-400">Tone(s)</span>
                <div className="flex flex-wrap gap-1">
                  {result.config.tone.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-[#0a5cff]/10 rounded text-[10px] font-mono border border-[#0a5cff]/30 text-blue-200">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-slate-400">Image Context</span>
                <span className="font-mono text-xs italic line-clamp-2 text-slate-300">{result.config.imageContext || 'N/A'}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800">
                <button className="w-full py-2 bg-[#0a5cff] rounded-lg hover:bg-[#0048d9] transition-colors font-bold text-white shadow-lg shadow-[#0a5cff]/20">
                  Sync to Production
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
