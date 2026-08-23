import React from 'react';
import { AuthUser } from '../types';
import { Fingerprint, ShieldCheck, X, Sparkles } from 'lucide-react';

interface BiometricPromptModalProps {
  isOpen: boolean;
  user: AuthUser;
  onEnable: () => void;
  onSkip: () => void;
}

export function BiometricPromptModal({ isOpen, user, onEnable, onSkip }: BiometricPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xs shadow-2xl p-6 text-center space-y-5">
        
        {/* Top Graphic Icon */}
        <div className="w-16 h-16 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-600/10 animate-pulse">
          <Fingerprint className="w-9 h-9" />
        </div>

        {/* Copy details */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-100 flex items-center justify-center gap-1">
            বায়োমেট্রিক লক চালু করুন
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            স্বাগতম <strong className="text-white">{user.name}</strong>! আপনি কি পরবর্তী লগইনে দ্রুত এবং সুরক্ষিত প্রবেশের জন্য ফিঙ্গারপ্রিন্ট বায়োমেট্রিক নিরাপত্তা চালু করতে চান?
          </p>
        </div>

        {/* Security endorsement */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center gap-2 text-[10px] text-slate-500 text-left">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>এটি সম্পূর্ণ সুরক্ষিতভাবে আপনার ব্রাউজার লোকালহোস্টে পিন লক হিসেবে ইনক্রিপ্ট থাকবে।</span>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onEnable}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            হ্যাঁ, চালু করুন 🔐
          </button>
          
          <button
            onClick={onSkip}
            className="w-full py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all active:scale-[0.98]"
          >
            পরে করবো (Skip)
          </button>
        </div>
      </div>
    </div>
  );
}
