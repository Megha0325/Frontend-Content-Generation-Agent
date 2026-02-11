
import React, { useState, useEffect, useMemo } from 'react';
import { WorkflowConfig, ContentType, Tone } from '../types';

interface WorkflowFormProps {
  onSubmit: (config: WorkflowConfig) => void;
  isLoading: boolean;
  initialContentTypes?: ContentType[];
  userEmail: string;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({ onSubmit, isLoading, initialContentTypes, userEmail }) => {
  const [topic, setTopic] = useState('');
  const [selectedContentTypes, setSelectedContentTypes] = useState<ContentType[]>([]);
  const [selectedTones, setSelectedTones] = useState<Tone[]>([]);
  const [imageContext, setImageContext] = useState('');
  const [genImages, setGenImages] = useState(true);
  const [targetEmail, setTargetEmail] = useState(userEmail);

  // Define platforms
  const socialPlatforms: ContentType[] = [
    'EXAIR - LinkedIn',
    'EXAIR Corporation - Facebook',
    'exair_corporation - Instagram',
    'EXAIR - Twitter'
  ];

  const allContentTypes: ContentType[] = [
    ...socialPlatforms,
    'Blog Post',
    'Email News Letter'
  ];

  const blogTones: Tone[] = ['Professional', 'Casual', 'Friendly', 'Technical', 'Conversational'];
  const socialTones: Tone[] = ['Informative', 'Sales Focused', 'Serious', 'Light Hearted'];
  const defaultTones: Tone[] = ['Professional', 'Inspirational', 'Authoritative', 'Witty'];

  const availableTones = useMemo(() => {
    if (selectedContentTypes.includes('Blog Post')) return blogTones;
    if (selectedContentTypes.some(t => socialPlatforms.includes(t))) return socialTones;
    return defaultTones;
  }, [selectedContentTypes]);

  useEffect(() => {
    if (initialContentTypes && initialContentTypes.length > 0) {
      setSelectedContentTypes(initialContentTypes);
      if (initialContentTypes.includes('Blog Post')) {
        setSelectedTones(['Professional']);
      } else if (initialContentTypes.some(t => socialPlatforms.includes(t))) {
        setSelectedTones(['Informative']);
      } else {
        setSelectedTones(['Professional']);
      }
    } else {
      setSelectedContentTypes(['Blog Post']);
      setSelectedTones(['Professional']);
    }
  }, [initialContentTypes]);

  // Keep target email in sync with logged in user unless they change it
  useEffect(() => {
    setTargetEmail(userEmail);
  }, [userEmail]);

  const visibleContentTypes = useMemo(() => {
    const hasSocialInitial = initialContentTypes?.some(t => socialPlatforms.includes(t));
    const hasNonSocialInitial = initialContentTypes?.some(t => !socialPlatforms.includes(t));
    if (hasSocialInitial && !hasNonSocialInitial) return socialPlatforms;
    return allContentTypes;
  }, [initialContentTypes]);

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
      imageContext: genImages ? imageContext : '',
      generateImages: genImages,
      targetEmail: targetEmail
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
            {visibleContentTypes.map(type => (
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
          {availableTones.map(tone => (
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

      <div className="space-y-4 pt-2 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Image Needed?</label>
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={genImages}
              onChange={() => setGenImages(!genImages)}
            />
            <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0a5cff]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0a5cff]"></div>
          </label>
        </div>

        {genImages && (
          <div className="space-y-1 animate-in slide-in-from-top-2 fade-in duration-300">
            <label className={labelClasses}>Visual Context / Image Prompt</label>
            <textarea
              rows={2}
              className={`${controlClasses} resize-none`}
              placeholder="e.g. A sleek industrial control room..."
              value={imageContext}
              onChange={(e) => setImageContext(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1 animate-in slide-in-from-top-1 fade-in duration-400">
          <label className={labelClasses}>Send to Email</label>
          <div className="relative">
            <input
              required
              type="email"
              className={`${controlClasses} pl-10`}
              placeholder="Enter delivery email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium italic mt-1 ml-1">Resulting assets and reports will be dispatched here.</p>
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
