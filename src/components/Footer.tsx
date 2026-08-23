import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-center py-6 mt-8 space-y-2 border-t border-slate-900/40">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
        <span>Daily Expense</span>
        <span className="text-rose-500">❤️</span>
        <span>দ্বারা তৈরি</span>
      </p>
      
      <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-600 font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500/80" />
        <span>১০০% সুরক্ষিত লোকাল ও ক্লাউড স্টোরেজ ব্যাকআপ সুবিধা</span>
      </div>

      <p className="text-[10px] font-medium text-slate-400">
        Made in India | Designed by Malay Karan / Srija Enterprise
      </p>

      <p className="text-[8px] text-slate-700 font-medium">
        © {new Date().getFullYear()} Daily Expense. All rights reserved. Version 2.0 (Stable)
      </p>
    </footer>
  );
}
