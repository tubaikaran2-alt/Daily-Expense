import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AuthUser } from '../types';
import { KeyRound, ShieldCheck, Check, X, Eye, EyeOff } from 'lucide-react';

interface ChangePinModalProps {
  isOpen: boolean;
  user: AuthUser;
  onPinChanged: (newPin: string) => void;
  onClose: () => void;
}

export function ChangePinModal({
  isOpen,
  user,
  onPinChanged,
  onClose,
}: ChangePinModalProps) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // If user already had a custom pin, verify old pin
    if (user.pin && user.pin !== '1234' && oldPin !== user.pin) {
      setErrorMsg('বর্তমান পিনটি সঠিক নয়!');
      return;
    }

    const cleanNew = newPin.trim();
    const cleanConfirm = confirmPin.trim();

    if (cleanNew.length !== 4 || !/^\d{4}$/.test(cleanNew)) {
      setErrorMsg('নতুন পিন অবশ্যই ঠিক ৪টি সংখ্যার হতে হবে');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setErrorMsg('নতুন পিন এবং নিশ্চিতকরণ পিন এক নয়!');
      return;
    }

    onPinChanged(cleanNew);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      {/* Dark backdrop */}
      <div
        onClick={onClose}
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
        className="z-[10000] w-[92vw] max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-center space-y-4 overflow-hidden animate-in zoom-in-95 duration-200 select-text cursor-default"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <KeyRound className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-100">সিক্রেট পিন পরিবর্তন করুন</h3>
          <p className="text-xs text-slate-400">
            আপনার ৪-সংখ্যার সিক্রেট পিন আপডেট করুন
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          {user.pin && user.pin !== '1234' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                বর্তমান পিন (Current PIN)
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                required
                maxLength={4}
                pattern="[0-9]{4}"
                inputMode="numeric"
                value={oldPin}
                onChange={(e) => {
                  setErrorMsg(null);
                  setOldPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.4em] px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm font-mono font-bold text-slate-100 outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              নতুন ৪-সংখ্যার পিন (New PIN)
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                maxLength={4}
                pattern="[0-9]{4}"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => {
                  setErrorMsg(null);
                  setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.4em] px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm font-mono font-bold text-slate-100 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              নতুন পিন নিশ্চিত করুন (Confirm New PIN)
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
              className="w-full text-center tracking-[0.4em] px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm font-mono font-bold text-slate-100 outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={newPin.length !== 4 || confirmPin.length !== 4}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>পিন আপডেট করুন (Update PIN)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
