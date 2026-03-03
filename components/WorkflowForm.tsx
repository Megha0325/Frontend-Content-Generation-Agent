
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WorkflowConfig, ContentType, Tone } from '../types';
import { analyzeReferenceImage } from '../services/geminiService';

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
  const [genImages, setGenImages] = useState(false);
  const [targetEmail, setTargetEmail] = useState(userEmail);
  
  // New Vision States
  const [refImageBase64, setRefImageBase64] = useState<string | null>(null);
  const [visionAnalysis, setVisionAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define platforms
  const socialPlatforms: ContentType[] = [
    'EXAIR - LinkedIn',
    'EXAIR Corporation - Facebook',
    'exair_corporation - Instagram',
    'EXAIR - Twitter'
  ];

  const isBlogMode = useMemo(() => initialContentTypes?.includes('Blog Post'), [initialContentTypes]);
  const isEmailMode = useMemo(() => initialContentTypes?.includes('Email News Letter'), [initialContentTypes]);
  const isSocialMode = useMemo(() => !isBlogMode && !isEmailMode, [isBlogMode, isEmailMode]);

  const blogTones: Tone[] = ['Professional', 'Casual', 'Friendly', 'Technical', 'Conversational'];
  const socialTones: Tone[] = ['Informative', 'Sales Focused', 'Serious', 'Light Hearted'];
  const defaultTones: Tone[] = ['Professional', 'Inspirational', 'Authoritative', 'Witty'];

  const availableTones = useMemo(() => {
    if (isBlogMode) return blogTones;
    if (isSocialMode) return socialTones;
    return defaultTones;
  }, [isBlogMode, isSocialMode]);

  useEffect(() => {
    if (isBlogMode) {
      setSelectedContentTypes(['Blog Post']);
    } else if (isEmailMode) {
      setSelectedContentTypes(['Email News Letter']);
    } else {
      setSelectedContentTypes([]);
    }
    setSelectedTones([]);
    setGenImages(false);
    setRefImageBase64(null);
    setVisionAnalysis('');
  }, [initialContentTypes, isBlogMode, isEmailMode]);

  useEffect(() => {
    setTargetEmail(userEmail);
  }, [userEmail]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setRefImageBase64(reader.result as string);
      setVisionAnalysis(''); // Reset previous analysis
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeReferenceImage(base64String, file.type);
        setVisionAnalysis(analysis);
      } catch (err) {
        console.error("Vision analysis failed", err);
        setVisionAnalysis("Analysis failed.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
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
      targetEmail: targetEmail,
      referenceImageDescription: visionAnalysis
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

      {isSocialMode && (
        <div className="space-y-1 animate-in fade-in duration-300">
          <label className={labelClasses}>Platform Selection</label>
          <p className="text-[10px] text-slate-400 font-medium mb-3 -mt-1">Select one or more social destinations</p>
          <div className="grid grid-cols-2 gap-2">
            {socialPlatforms.map(type => (
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
        {!isEmailMode && (
          <>
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
              <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="space-y-1">
                  <label className={labelClasses}>Visual Context / Image Prompt</label>
                  <textarea
                    rows={2}
                    className={`${controlClasses} resize-none`}
                    placeholder="e.g. A sleek industrial control room..."
                    value={imageContext}
                    onChange={(e) => setImageContext(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>Reference Image (Optional)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                      refImageBase64 ? 'border-[#0a5cff] bg-blue-50/30' : 'border-slate-200 hover:border-[#0a5cff]/50 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {refImageBase64 ? (
                      <div className="flex items-center space-x-4 w-full">
                        <img src={refImageBase64} alt="Ref" className="w-16 h-16 rounded-lg object-cover shadow-sm border border-white" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700">Reference Loaded</p>
                          <p className="text-[10px] text-slate-500 truncate">Tap to change image</p>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setRefImageBase64(null); setVisionAnalysis(''); }}
                          className="p-2 text-slate-400 hover:text-red-500"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-medium text-slate-500">Upload an image for style matching</span>
                      </>
                    )}
                  </div>

                  {/* Vision Status Indicator */}
                  <div className="flex items-center justify-start h-6 px-1">
                    {isAnalyzing && (
                      <div className="flex items-center space-x-2 animate-in fade-in duration-300">
                        <svg className="animate-spin h-3.5 w-3.5 text-[#0a5cff]" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Style...</span>
                      </div>
                    )}
                    {visionAnalysis && !isAnalyzing && (
                      <div className="flex items-center space-x-1.5 text-green-500 animate-in zoom-in duration-300">
                        <div className="bg-green-100 rounded-full p-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Style Profile Synced</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
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
        </div>
      </div>

      <button
        disabled={isLoading || isAnalyzing}
        type="submit"
        className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
          (isLoading || isAnalyzing) 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-[#0a5cff] hover:bg-[#0048d9] active:scale-[0.98] shadow-[#0a5cff]/20 hover:shadow-[#0a5cff]/30'
        }`}
      >
        {isLoading || isAnalyzing ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{isAnalyzing ? 'Vision Analysis...' : 'Orchestrating...'}</span>
          </div>
        ) : 'Execute Content Automation'}
      </button>
    </form>
  );
};

export default WorkflowForm;
