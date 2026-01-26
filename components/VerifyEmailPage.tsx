
import React, { useState } from 'react';

interface VerifyEmailPageProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ email, onVerified, onResend }) => {
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      onResend();
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0a5cff]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0a5cff]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#0a5cff]/10 rounded-3xl flex items-center justify-center text-[#0a5cff] mx-auto mb-6 shadow-xl shadow-[#0a5cff]/5">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verify Your Email</h1>
          <p className="text-slate-500 mt-3 font-medium leading-relaxed">
            We've sent a verification link to <br />
            <span className="text-slate-900 font-bold">{email}</span>
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 text-center">
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Please check your inbox and click the link to activate your account. If you don't see it, check your spam folder.
          </p>

          <div className="space-y-4">
            <button
              onClick={onVerified}
              className="w-full py-4 bg-[#0a5cff] hover:bg-[#0048d9] text-white font-bold rounded-xl shadow-lg shadow-[#0a5cff]/20 transition-all active:scale-[0.98]"
            >
              Verify & Get Started
            </button>
            
            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full py-4 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-2"
            >
              {isResending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#0a5cff]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Resending...</span>
                </>
              ) : (
                <span>Resend Link</span>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50">
            <p className="text-xs text-slate-400">
              Simulating automation environment. <br />
              Gmail & Outlook API connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
