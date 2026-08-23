import React, { useState } from 'react';
import { AuthUser } from '../types';
import { Fingerprint, Lock, ShieldAlert, KeyRound, LogOut, Loader2, RefreshCw, Wallet } from 'lucide-react';

interface BiometricUnlockScreenProps {
  savedUser: AuthUser;
  onUnlockSuccess: (user: AuthUser) => void;
  onSwitchToPassword: () => void;
  onSwitchAccount: () => void;
}

export function BiometricUnlockScreen({
  savedUser,
  onUnlockSuccess,
  onSwitchToPassword,
  onSwitchAccount,
}: BiometricUnlockScreenProps) {
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const triggerFingerprintScan = () => {
    if (scanningState === 'scanning') return;
    setScanningState('scanning');

    setTimeout(() => {
      // Simulate fingerprint matching success (95% success rate for simulation fidelity!)
      const randomSuccess = Math.random() < 0.95;
      if (randomSuccess) {
        setScanningState('success');
        setTimeout(() => {
          onUnlockSuccess(savedUser);
        }, 800);
      } else {
        setScanningState('failed');
        setTimeout(() => setScanningState('idle'), 2500);
      }
    }, 1500);
  };

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(false);

    if (pin.trim() === savedUser.pin) {
      onUnlockSuccess(savedUser);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 select-none">
      
      {/* Brand Watermark logo */}
      <div className="text-center space-y-1.5 mb-10">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
          <Wallet className="w-5 h-5" />
        </div>
        <p className="text-[10px] uppercase font-black tracking-widest text-indigo-500/80">Daily Expense Security</p>
      </div>

      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl space-y-6">
        
        {/* User profile avatar and Name */}
        <div className="space-y-3">
          <div className="relative inline-block">
            {savedUser.photoUrl ? (
              <img
                src={savedUser.photoUrl}
                alt={savedUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/40"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-black uppercase text-white border-2 border-indigo-500/40">
                {savedUser.name.slice(0, 1)}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 p-1 bg-slate-950 border border-slate-850 text-indigo-400 rounded-full">
              <Lock className="w-3.5 h-3.5 fill-indigo-400/20" />
            </span>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-200">{savedUser.name}</h3>
            <p className="text-[10px] text-slate-500 font-medium">{savedUser.email}</p>
          </div>
        </div>

        {/* Dynamic biometric sensor & scanner UI */}
        <div className="py-4 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={triggerFingerprintScan}
            disabled={scanningState === 'scanning'}
            className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer relative ${
              scanningState === 'scanning'
                ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-xl shadow-indigo-500/10'
                : scanningState === 'success'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-xl shadow-emerald-500/10'
                : scanningState === 'failed'
                ? 'border-rose-500 bg-rose-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950'
            }`}
          >
            {/* Pulsing scanning rings */}
            {scanningState === 'scanning' && (
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-60" />
            )}

            <Fingerprint
              className={`w-10 h-10 transition-all ${
                scanningState === 'scanning'
                  ? 'text-indigo-400 animate-pulse'
                  : scanningState === 'success'
                  ? 'text-emerald-400 scale-110'
                  : scanningState === 'failed'
                  ? 'text-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            />
          </button>

          {/* Scanner Feedback labels */}
          <div className="h-6">
            <span className={`text-xs font-bold ${
              scanningState === 'scanning'
                ? 'text-indigo-400'
                : scanningState === 'success'
                ? 'text-emerald-400'
                : scanningState === 'failed'
                ? 'text-rose-400'
                : 'text-slate-500 hover:text-slate-400 cursor-pointer'
            }`} onClick={triggerFingerprintScan}>
              {scanningState === 'scanning' && 'আঙুলের ছাপ স্ক্যান করা হচ্ছে...'}
              {scanningState === 'success' && 'স্ক্যান ভেরিফাই সফল!'}
              {scanningState === 'failed' && 'ম্যাচিং ব্যর্থ! আবার চেষ্টা করুন।'}
              {scanningState === 'idle' && 'আনলক করতে ফিঙ্গারপ্রিন্ট সেন্সরে চাপুন'}
            </span>
          </div>
        </div>

        {/* PIN lock alternative entry form */}
        <div className="border-t border-slate-850/80 pt-4 space-y-3.5">
          <form onSubmit={handlePinUnlock} className="space-y-2 max-w-[200px] mx-auto">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                পিন দিয়ে প্রবেশ করুন
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => {
                  setPinError(false);
                  setPin(e.target.value);
                }}
                placeholder="৪-ডিজিট পিন"
                className="w-full text-center px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs font-mono tracking-widest text-slate-200 outline-none"
              />
            </div>

            {pinError && (
              <p className="text-[9px] font-bold text-rose-400">ভুল পিন নম্বর!</p>
            )}

            {pin.length === 4 && (
              <button
                type="submit"
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-bold transition-all active:scale-95"
              >
                পিন ভেরিফাই
              </button>
            )}
          </form>
        </div>

        {/* Footer controls: Switch account, etc. */}
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-t border-slate-850/80 pt-4">
          <button
            onClick={onSwitchToPassword}
            className="hover:text-slate-300 flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>সিক্রেট পিন</span>
          </button>
          
          <button
            onClick={onSwitchAccount}
            className="hover:text-rose-400 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
