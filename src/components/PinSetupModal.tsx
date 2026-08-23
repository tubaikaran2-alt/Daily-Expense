import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AuthUser } from '../types';
import { KeyRound, ShieldCheck, Check, Sparkles, X, Lock, Eye, EyeOff } from 'lucide-react';

interface PinSetupModalProps {
  isOpen: boolean;
  user: AuthUser;
  onPinSaved: (newPin: string) => void;
  onClose?: () => void;
  isMandatory?: boolean;
}

export function PinSetupModal({
  isOpen,
  user,
  onPinSaved,
  onClose,
  isMandatory = false,
}: PinSetupModalProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPin = pin.trim();
    const cleanConfirm = confirmPin.trim();

    if (cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      setErrorMsg('পিন অবশ্যই ঠিক ৪টি সংখ্যার হতে হবে (যেমন: 1234)');
      return;
    }

    if (cleanPin !== cleanConfirm) {
      setErrorMsg('উভয় পিন এক নয়! অনুগ্রহ করে একই ৪-সংখ্যার পিন পুনরায় টাইপ করুন।');
      return;
    }

    onPinSaved(cleanPin);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      {/* Dark backdrop */}
      <div
        onClick={() => {
          if (!isMandatory && onClose) onClose();
        }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer transition-opacity"
      />

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="z-[10000] w-[92vw] max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-center space-y-5 overflow-hidden animate-in zoom-in-95 duration-200 select-text cursor-default"
      >
        {!isMandatory && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Lock Graphic */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <KeyRound className="w-7 h-7" />
        </div>

        {/* Heading & description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-base font-black text-slate-100">৪-সংখ্যার সিক্রেট পিন সেট করুন</h3>
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-[260px] mx-auto">
            স্বাগতম <strong className="text-white">{user.name}</strong>! আপনার হিসাব ও অ্যাপ সুরক্ষিত রাখতে একটি ৪-সংখ্যার সিক্রেট পিন দিন।
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              নতুন ৪-ডিজিট পিন (New 4-Digit PIN)
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                maxLength={4}
                pattern="[0-9]{4}"
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setErrorMsg(null);
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-base font-mono font-bold text-slate-100 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                title={showPin ? 'লুকান' : 'দেখান'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              পিন নিশ্চিত করুন (Confirm PIN)
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              required
              maxLength={4}
              pattern="[0-9]{4}"
              inputMode="numeric"
              value={confirmPin}
              onChange={(e) => {
                setErrorMsg(null);
                setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4));
              }}
              placeholder="••••"
              className="w-full text-center tracking-[0.5em] px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-base font-mono font-bold text-slate-100 outline-none"
            />
          </div>

          {/* Quick Security Badge */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>অ্যাপ লক হলে এই পিন দিয়ে আনলক করা যাবে।</span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={pin.length !== 4 || confirmPin.length !== 4}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>পিন সংরক্ষণ করুন (Save PIN)</span>
            </button>

            {!isMandatory && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                পরে সেট করবো (Skip for Now)
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
