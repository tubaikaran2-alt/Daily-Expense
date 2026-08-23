import React, { useState } from 'react';
import { WifiOff, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';

interface OfflineBlockerProps {
  onCheckConnection: () => void;
}

export function OfflineBlocker({ onCheckConnection }: OfflineBlockerProps) {
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRetry = () => {
    setChecking(true);
    setFeedback(null);

    setTimeout(() => {
      setChecking(false);
      // Trigger the parent internet connection status check
      onCheckConnection();
      
      if (!navigator.onLine) {
        setFeedback('দুঃখিত, কোনো ইন্টারনেট সংযোগ পাওয়া যায়নি। আবার চেষ্টা করুন!');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-6 py-8 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl space-y-6">
        
        {/* Offline Graphic Zone */}
        <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-500/10 animate-pulse">
          <WifiOff className="w-8 h-8" />
        </div>

        {/* Copy details */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-100">ইন্টারনেট সংযোগ বিচ্ছিন্ন!</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Daily Expense অ্যাপ্লিকেশনটি গুগল শিটের সাথে লাইভ সিঙ্ক করার জন্য এবং সিকিউরিটি ডাটাবেজ সুরক্ষার জন্য একটি সক্রিয় ইন্টারনেট কানেকশন প্রয়োজন।
          </p>
        </div>

        {feedback && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed">
            {feedback}
          </div>
        )}

        {/* Retry button action */}
        <button
          onClick={handleRetry}
          disabled={checking}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950/40 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {checking ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>কানেকশন চেক করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>পুনরায় কানেক্ট চেক করুন</span>
            </>
          )}
        </button>

        {/* Interactive tip */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-1 text-left">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/25" />
            <span className="text-[10px] font-black text-slate-300">একটি টিপস:</span>
          </div>
          <p className="text-[9px] text-slate-500 leading-normal">
            আপনার ওয়াইফাই (Wi-Fi) বা মোবাইল ডাটা (Mobile Data) চালু আছে কিনা নিশ্চিত করুন এবং ব্রাউজার পেজটি রিলোড দিন।
          </p>
        </div>
      </div>
    </div>
  );
}
