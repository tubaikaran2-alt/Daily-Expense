import React, { useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CloudUpload, CheckCircle2, AlertCircle } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
  unsyncedCount: number;
  isSyncing: boolean;
  onManualSync: () => void;
}

export function OfflineIndicator({
  isOnline,
  unsyncedCount,
  isSyncing,
  onManualSync,
}: OfflineIndicatorProps) {
  const [checking, setChecking] = useState(false);

  const handleCheckConnection = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      onManualSync();
    }, 600);
  };

  if (isOnline && unsyncedCount === 0) {
    return null;
  }

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-2xl px-4 py-3 transition-all duration-300 shadow-lg border ${
        !isOnline
          ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
          : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
              !isOnline
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
            }`}
          >
            {!isOnline ? (
              <WifiOff className="w-4 h-4 animate-pulse" />
            ) : (
              <CloudUpload className="w-4 h-4 animate-bounce" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black tracking-tight">
                {!isOnline ? 'অফলাইন মোড (Offline Mode)' : 'অনলাইন সংযোগ ফিরে এসেছে'}
              </span>
              {!isOnline && (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40">
                  ডিভাইসে সংরক্ষিত
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {!isOnline
                ? `${unsyncedCount > 0 ? `${unsyncedCount} টি এন্ট্রি জমা আছে` : 'সমস্ত হিসাব ডিভাইসে সংরক্ষিত হচ্ছে'} • নেট পেলে অটো-সিঙ্ক হবে`
                : `${unsyncedCount} টি অফলাইন এন্ট্রি Google Sheet-এ সিঙ্ক হচ্ছে...`}
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckConnection}
          disabled={isSyncing || checking}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer border ${
            !isOnline
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
          } disabled:opacity-60`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing || checking ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isSyncing || checking ? 'সিঙ্ক হচ্ছে...' : !isOnline ? 'চেক করুন' : 'এখন সিঙ্ক'}
          </span>
        </button>
      </div>
    </div>
  );
}
