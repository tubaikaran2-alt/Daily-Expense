import React, { useEffect, useRef } from 'react';
import { Crown, Sparkles, X, ShieldCheck, Terminal } from 'lucide-react';
import { ADMOB_CONFIG, admobService } from '../services/admobService';

interface AdBannerProps {
  position: 'mid-content' | 'bottom-feed';
  onUpgradeClick: () => void;
  isPremium?: boolean;
}

export function AdBanner({ position, onUpgradeClick, isPremium = false }: AdBannerProps) {
  useEffect(() => {
    if (isPremium) {
      admobService.hideNativeBanner();
      return;
    }

    // Try showing native AdMob banner if in native wrapper
    const containerId = `admob-banner-${position}`;
    const success = admobService.showNativeBanner(containerId);
    if (success) {
      console.log(`[AdMob] Native banner initialized in container: ${containerId}`);
    }
  }, [position, isPremium]);

  if (isPremium) return null;

  return (
    <div 
      id={`admob-banner-${position}`}
      className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800/80 p-4 shadow-xl transition-all hover:border-slate-700/60"
    >
      {/* Absolute badge */}
      <span className="absolute top-3 right-3 text-[8px] font-black tracking-widest text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 uppercase">
        AdMob Ads
      </span>

      <div className="flex flex-col gap-3">
        <div className="flex gap-4 items-center">
          {/* Banner Graphics Icon */}
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Crown className="w-5 h-5 fill-indigo-400/10" />
          </div>

          {/* Text copy */}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
              {position === 'mid-content' ? 'হিসাব খাতা প্রিমিয়াম প্লাস' : 'ক্লাউড অটো-সিঙ্ক ও সিকিউরিটি'}
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5 max-w-[280px]">
              {position === 'mid-content'
                ? 'একটি ক্লিকের মাধ্যমে বিরক্তিকর বিজ্ঞাপন বন্ধ করুন এবং ৭ দিনের এনালাইটিক্স গ্রাফ আনলক করুন।'
                : 'অফলাইন ও অনলাইন সুরক্ষিত ব্যাকআপ সুবিধা। মাত্র এককালীন ₹৯৯ পেমেন্টে লাইফটাইম মেম্বার হোন।'}
            </p>
          </div>

          {/* CTA Upgrade Button */}
          <button
            onClick={onUpgradeClick}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-lg shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer"
          >
            আপগ্রেড 👑
          </button>
        </div>

        {/* AdMob Configuration Info Badge for Developer */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-850 text-[8px] font-medium text-slate-500 font-mono">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>ID: {ADMOB_CONFIG.android.bannerUnitId}</span>
        </div>
      </div>
    </div>
  );
}
