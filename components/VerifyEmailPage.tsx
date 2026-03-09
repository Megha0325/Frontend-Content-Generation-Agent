
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
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0a5cff]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0a5cff]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0a5cff] rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-[#0a5cff]/30 mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verify your email</h1>
          <p className="text-slate-500 mt-2 font-medium">We've sent a verification link to</p>
          <p className="text-[#0a5cff] font-bold mt-1">{email}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 text-center">
          <p className="text-slate-600 mb-8 leading-relaxed">
            Please check your inbox and click the link to activate your account. If you don't see it, check your spam folder.
          </p>

          <button
            onClick={onVerified}
            className="w-full py-4 bg-[#0a5cff] hover:bg-[#0048d9] text-white font-bold rounded-xl shadow-lg shadow-[#0a5cff]/20 transition-all active:scale-[0.98] flex items-center justify-center"
          >
            Go to Sign In
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Didn't receive the email? <button onClick={handleResend} disabled={isResending} className="text-[#0a5cff] font-bold hover:underline">
              {isResending ? 'Resending...' : 'Resend link'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
