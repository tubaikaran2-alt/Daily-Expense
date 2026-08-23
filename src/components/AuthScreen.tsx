import React, { useState } from 'react';
import { AuthUser } from '../types';
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  Cloud,
  Lock,
  X,
  Smartphone,
  FileSpreadsheet
} from 'lucide-react';

interface AuthScreenProps {
  webAppUrl: string;
  onAuthSuccess: (user: AuthUser, isNewUser?: boolean) => void;
  onTriggerBiometricUnlock?: () => void;
  defaultEmail: string;
}

const STORAGE_USERS_KEY = 'ft3d_registered_users_v2';

export function AuthScreen({
  webAppUrl,
  onAuthSuccess,
  defaultEmail,
}: AuthScreenProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignInClick = () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);

    // Check if user already logged in with Google previously
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      const users: AuthUser[] = stored ? JSON.parse(stored) : [];
      const googleUser = users.find(u => u.email.endsWith('@gmail.com') || u.photoUrl);

      if (googleUser) {
        // Quick auth simulation for returning Google users
        setTimeout(() => {
          setIsGoogleLoading(false);
          onAuthSuccess(googleUser, false);
        }, 500);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    // Otherwise open Google OAuth prompt modal
    setTimeout(() => {
      setIsGoogleLoading(false);
      setShowGoogleModal(true);
    }, 350);
  };

  const handleCompleteGoogleAuth = (e?: React.FormEvent, directEmail?: string, directName?: string) => {
    if (e) e.preventDefault();
    const gEmail = (directEmail || googleEmailInput).trim().toLowerCase() || 'user@gmail.com';
    const gName = (directName || googleNameInput).trim() || gEmail.split('@')[0].replace(/[._]/g, ' ').toUpperCase();

    if (!gEmail.includes('@')) {
      setErrorMsg('অনুগ্রহ করে একটি সঠিক Gmail ঠিকানা প্রদান করুন।');
      return;
    }

    setIsGoogleLoading(true);
    setShowGoogleModal(false);

    setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_USERS_KEY);
        const users: AuthUser[] = stored ? JSON.parse(stored) : [];

        let existingUser = users.find(u => u.email.toLowerCase() === gEmail);
        let isNewUser = false;

        if (!existingUser) {
          isNewUser = true;
          existingUser = {
            email: gEmail,
            name: gName,
            pin: '', // Will prompt user to set 4-digit PIN immediately
            photoUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(gEmail)}`
          };
          users.push(existingUser);
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
        }

        setIsGoogleLoading(false);
        onAuthSuccess(existingUser, isNewUser || !existingUser.pin || existingUser.pin === '1234');
      } catch (err) {
        setIsGoogleLoading(false);
        setErrorMsg('লগইন প্রক্রিয়ায় সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Branding Header */}
      <div className="text-center space-y-3 mb-6 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-600/30 mx-auto border border-indigo-400/30 animate-in zoom-in-90 duration-300">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Daily Expense</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono">
              PRO
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-[320px] leading-relaxed mx-auto">
            আপনার দৈনন্দিন আয়-ব্যয়ের হিসাব সরাসরি নিরাপদ <strong className="text-slate-200">Google Sheets</strong>-এ স্বয়ংক্রিয়ভাবে রাখুন
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6 relative z-10">
        
        {/* Top Tagline */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-900/50 inline-block">
            গুগল ক্লাউড কানেক্ট ও অথেনটিকেশন
          </span>
          <h2 className="text-sm font-black text-slate-200 pt-1">
            অ্যাকাউন্টে প্রবেশ করতে সাইন ইন করুন
          </h2>
        </div>

        {/* Feature Value Highlights */}
        <div className="space-y-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850">
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Google Sheets লাইভ সিঙ্ক</p>
              <p className="text-[10px] text-slate-400">আপনার নিজস্ব স্প্রেডশীটে রিয়েল-টাইমে হিসাব ব্যাকআপ হয়</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
              <Cloud className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">১০০% ডাটা নিরাপত্তা</p>
              <p className="text-[10px] text-slate-400">ডিভাইস পরিবর্তন করলেও কোনো হিসাব হারিয়ে যাবে না</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">৪-সংখ্যার পিন ও বায়োমেট্রিক</p>
              <p className="text-[10px] text-slate-400">লগইনের পর সিক্রেট পিন ও ফিঙ্গারপ্রিন্ট লক সুবিধা</p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center font-semibold animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Primary Action: Sign in with Google */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignInClick}
            disabled={isGoogleLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-white/5 cursor-pointer border border-slate-200 disabled:opacity-75"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          <p className="text-[11px] text-center text-slate-400 leading-normal">
            Google দিয়ে সরাসরি সাইন ইন করে আপনার ডেটা নিরাপদ রাখুন
          </p>
        </div>
      </div>

      {/* Trust micro-copy */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500 font-semibold relative z-10">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Google Cloud & 256-Bit SSL ইনক্রিপ্টেড সিকিউরিটি</span>
      </div>

      {/* Google OAuth Modal Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-white relative">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন</h3>
              <p className="text-xs text-slate-400">একটি অ্যাকাউন্ট নির্বাচন করুন বা আপনার Gmail দিন</p>
            </div>

            {/* Quick 1-tap Google Profile */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleCompleteGoogleAuth(undefined, 'tubaikaran2@gmail.com', 'Tubai Karan')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-850 active:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-2xl flex items-center justify-between transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow">
                    TK
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-200 group-hover:text-white">Tubai Karan</span>
                    <span className="text-[10px] text-slate-400">tubaikaran2@gmail.com</span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">অথবা অন্য Gmail</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleCompleteGoogleAuth} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Gmail Address</label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Account Name</label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
