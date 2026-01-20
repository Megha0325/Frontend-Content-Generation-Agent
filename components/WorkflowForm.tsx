
import React, { useState, useEffect } from 'react';
import { WorkflowConfig, ContentType, Tone } from '../types';

interface WorkflowFormProps {
  onSubmit: (config: WorkflowConfig) => void;
  isLoading: boolean;
  initialContentTypes?: ContentType[];
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({ onSubmit, isLoading, initialContentTypes }) => {
  const [topic, setTopic] = useState('');
  const [selectedContentTypes, setSelectedContentTypes] = useState<ContentType[]>([]);
  const [selectedTones, setSelectedTones] = useState<Tone[]>(['Professional']);
  const [imageContext, setImageContext] = useState('');
  const [genImages, setGenImages] = useState(true);

  useEffect(() => {
    if (initialContentTypes && initialContentTypes.length > 0) {
      setSelectedContentTypes(initialContentTypes);
    } else {
      setSelectedContentTypes(['Blog Post']);
    }
  }, [initialContentTypes]);

  const contentTypes: ContentType[] = [
    'EXAIR - LinkedIn',
    'EXAIR Corporation - Facebook',
    'exair_corporation - Instagram',
    'EXAIR - Twitter',
    'Blog Post',
    'Email News Letter'
  ];

  const tones: Tone[] = ['Professional', 'Casual', 'Witty', 'Authoritative', 'Inspirational'];

  const toggleContentType = (type: ContentType) => {
    setSelectedContentTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTone = (tone: Tone) => {
    setSelectedTones(prev => 
      prev.includes(tone) ? prev.filter(t => t !== tone) : [...prev, tone]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContentTypes.length === 0) {
      alert("Please select at least one Platform/Type");
      return;
    }
    if (selectedTones.length === 0) {
      alert("Please select at least one Tone");
      return;
    }
    onSubmit({
      topic,
      contentType: selectedContentTypes,
      tone: selectedTones,
      imageContext,
      generateImages: genImages
    });
  };

  const controlClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0a5cff]/50 focus:border-[#0a5cff] transition-all outline-none bg-white text-slate-800 shadow-sm text-sm";
  const labelClasses = "text-sm font-semibold text-slate-700 uppercase tracking-wider block mb-2";

  const chipClasses = (selected: boolean) => 
    `px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer flex items-center justify-center text-center ${
      selected 
      ? 'bg-[#0a5cff] border-[#0a5cff] text-white shadow-md' 
      : 'bg-white border-slate-200 text-slate-600 hover:border-[#0a5cff]/50 hover:bg-slate-50'
    }`;

  // Determine if we should show the platform selector. 
  // If the agent selection only has one type (like 'Blog Post'), we hide it as it's specialized.
  const showPlatformSelector = !initialContentTypes || initialContentTypes.length > 1;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="space-y-1">
        <label className={labelClasses}>Content Topic</label>
        <input
          required
          type="text"
          className={controlClasses}
          placeholder="e.g. Benefits of Intelligent Compressed Air Products"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      {showPlatformSelector && (
        <div className="space-y-1 animate-in fade-in duration-300">
          <label className={labelClasses}>Platform / Type </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {contentTypes.map(type => (
              <div 
                key={type} 
                onClick={() => toggleContentType(type)}
                className={chipClasses(selectedContentTypes.includes(type))}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      )}

      {!showPlatformSelector && selectedContentTypes.length > 0 && (
        <div className="flex items-center space-x-2 pb-2">
           <span className="text-[10px] font-bold bg-[#0a5cff]/10 text-[#0a5cff] px-2 py-0.5 rounded uppercase tracking-tighter border border-[#0a5cff]/20">
             Targeting: {selectedContentTypes[0]}
           </span>
        </div>
      )}

      <div className="space-y-1">
        <label className={labelClasses}>Tone of Voice </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {tones.map(tone => (
            <div 
              key={tone} 
              onClick={() => toggleTone(tone)}
              className={chipClasses(selectedTones.includes(tone))}
            >
              {tone}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8 space-y-1">
          <label className={labelClasses}>Image Context / Prompt</label>
          <input
            type="text"
            className={controlClasses}
            placeholder="e.g. Industrial factory setting with clean air lines"
            value={imageContext}
            onChange={(e) => setImageContext(e.target.value)}
          />
        </div>

        <div className="md:col-span-4 space-y-1">
          <label className={labelClasses}>Image Needed?</label>
          <select
            className={controlClasses}
            value={genImages ? 'yes' : 'no'}
            onChange={(e) => setGenImages(e.target.value === 'yes')}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
          isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-[#0a5cff] hover:bg-[#0048d9] active:scale-[0.98] shadow-[#0a5cff]/20 hover:shadow-[#0a5cff]/30'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Orchestrating Workflow...</span>
          </div>
        ) : 'Execute Content Automation'}
      </button>
    </form>
  );
};

export default WorkflowForm;
