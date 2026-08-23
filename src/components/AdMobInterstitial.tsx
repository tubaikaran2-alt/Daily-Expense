import React, { useState, useEffect } from 'react';
import { X, Sparkles, Crown, ShieldAlert, Award, Volume2, Info } from 'lucide-react';
import { ADMOB_CONFIG } from '../services/admobService';

interface AdMobInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}

export function AdMobInterstitial({ isOpen, onClose, onUpgradeClick }: AdMobInterstitialProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(5);
    setCanClose(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in">
      {/* Real AdMob looking frame */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-slate-950 border border-slate-850 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header bar simulating native AdMob header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black tracking-widest text-white/50 bg-slate-950 px-1.5 py-0.5 rounded uppercase border border-slate-800">
              AdMob Test Ad
            </span>
            <Info className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="flex items-center gap-2">
            {!canClose ? (
              <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                বিজ্ঞাপন বন্ধ হবে {countdown} সেকেন্ডে
              </span>
            ) : (
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-90 cursor-pointer"
                title="বিজ্ঞাপন বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between items-center text-center space-y-6">
          
          {/* Ad Creative Artwork / Visuals */}
          <div className="space-y-4 w-full">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 animate-bounce">
              <Crown className="w-8 h-8 fill-amber-400/10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                Daily Expense Pro 👑
              </h2>
              <p className="text-xs text-slate-400">হিসাব খাতা প্রিমিয়াম সংস্করণ</p>
            </div>

            {/* Ad copy block */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-850 space-y-2 text-left">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold">এককালীন মাত্র ₹৯৯ (লাইফটাইম)</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>সমস্ত বিরক্তিকর বিজ্ঞাপন চিরতরে বন্ধ করুন।</li>
                <li>১০০% সুরক্ষিত ক্লাউড অটো-সিঙ্ক ও গুগল শীট ব্যাকআপ।</li>
                <li>সরাসরি ইনকাম ও এক্সপেন্স ট্রেন্ড এনালাইসিস গ্রাফ।</li>
                <li>আনলিমিটেড ডাটাবেজ ব্যাকআপ ও সেভিংস ট্র্যাক করুন।</li>
              </ul>
            </div>
          </div>

          {/* Ad Call To Action */}
          <div className="w-full space-y-3 pt-4">
            <button
              onClick={() => {
                onUpgradeClick();
                onClose();
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>বিজ্ঞাপন সরান - আপগ্রেড করুন ₹৯৯</span>
            </button>

            <button
              onClick={canClose ? onClose : undefined}
              disabled={!canClose}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                canClose
                  ? 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 cursor-pointer active:scale-95'
                  : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
              }`}
            >
              {canClose ? 'বিজ্ঞাপন এড়িয়ে যান (Skip Ad)' : `অপেক্ষা করুন (${countdown}s)`}
            </button>
          </div>

        </div>

        {/* Footer info banner */}
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-900/60 text-center">
          <p className="text-[8px] text-slate-600 font-medium">
            This interstitial is loaded with AdMob unit: {ADMOB_CONFIG.android.interstitialUnitId.substring(0, 15)}...
          </p>
        </div>

      </div>
    </div>
  );
}
