import React, { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import {
  User,
  ShieldCheck,
  Lock,
  LogOut,
  Crown,
  Sparkles,
  Camera,
  Layers,
  Wallet,
  Image,
  KeyRound,
  Fingerprint,
  ChevronRight,
  Users,
  Copy,
  Check,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  getReferralNetwork,
  getShareUrl,
  ReferralNetworkState
} from '../utils/referralService';
import { ReferralChainModal } from './ReferralChainModal';
import { ChangePinModal } from './ChangePinModal';

interface ProfileViewProps {
  currentUser: AuthUser;
  transactionCount: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  isBiometricEnabled: boolean;
  onToggleBiometric: (enabled: boolean) => void;
  onUpdatePin: (newPin: string) => void;
  onLogout: () => void;
  onLockApp: () => void;
  isPremium: boolean;
  onOpenPremium: () => void;
  onUpdatePhoto: (photoUrl: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
];

export function ProfileView({
  currentUser,
  transactionCount,
  totalIncome,
  totalExpense,
  balance,
  isBiometricEnabled,
  onToggleBiometric,
  onUpdatePin,
  onLogout,
  onLockApp,
  isPremium,
  onOpenPremium,
  onUpdatePhoto,
}: ProfileViewProps) {
  const [photoUrlInput, setPhotoUrlInput] = useState(currentUser.photoUrl || '');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralState, setReferralState] = useState<ReferralNetworkState>(() =>
    getReferralNetwork(currentUser.email, currentUser.name)
  );

  // Sync referral state whenever currentUser changes
  useEffect(() => {
    setReferralState(getReferralNetwork(currentUser.email, currentUser.name));
  }, [currentUser, isReferralModalOpen]);

  const handleUpdatePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoUrlInput.trim()) {
      onUpdatePhoto(photoUrlInput.trim());
      setShowAvatarSelector(false);
    }
  };

  const handlePresetSelect = (url: string) => {
    setPhotoUrlInput(url);
    onUpdatePhoto(url);
    setShowAvatarSelector(false);
  };

  const handleCopyReferralLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = getShareUrl(referralState.referralCode);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const progressPercent = Math.min(100, Math.round((referralState.currentLevel / 50) * 100));

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. HERO PROFILE CARD */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

        {/* Profile Avatar & Selector Button */}
        <div className="relative inline-block group">
          {currentUser.photoUrl ? (
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-950 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-black uppercase text-white border-4 border-slate-950 shadow-md">
              {currentUser.name.slice(0, 1)}
            </div>
          )}

          {/* Edit Avatar Toggle */}
          <button
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full border-2 border-slate-950 cursor-pointer shadow transition-all active:scale-90"
            title="ছবি পরিবর্তন"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Details */}
        <div>
          <h2 className="text-base font-black text-slate-100 flex items-center justify-center gap-1.5">
            {currentUser.name}
            {isPremium && (
              <span className="p-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full" title="VIP Member">
                <Crown className="w-3.5 h-3.5 fill-amber-500/10" />
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-semibold">{currentUser.email}</p>
        </div>

        {/* Avatar Preset Grid Selector */}
        {showAvatarSelector && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-4 animate-fade-in text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              ডিফল্ট এভাটার সিলেক্ট করুন (Preset Avatars)
            </span>
            <div className="flex gap-2.5 justify-center flex-wrap">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(url)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-105 active:scale-90 ${
                    photoUrlInput === url ? 'border-indigo-500 scale-105' : 'border-slate-800'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Photo Link Custom Input URL */}
            <form onSubmit={handleUpdatePhotoSubmit} className="space-y-2 pt-1 border-t border-slate-900/50">
              <label className="text-[9px] font-bold text-slate-500 uppercase block">
                অথবা কাস্টম ছবি লিংক (Paste Image URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-[10px] outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold transition-all active:scale-95"
                >
                  আপডেট ছবি
                </button>
              </div>
            </form>

            {/* Custom Device File Upload */}
            <div className="space-y-2 pt-3 border-t border-slate-900/50">
              <label className="text-[9px] font-bold text-slate-500 uppercase block">
                ডিভাইস থেকে ছবি আপলোড করুন (Upload from Device)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        if (base64) {
                          onUpdatePhoto(base64);
                          setPhotoUrlInput(base64);
                          setShowAvatarSelector(false);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-xl text-[10px] font-bold text-indigo-400 flex items-center justify-center gap-1.5 transition-all">
                  <Image className="w-4 h-4" />
                  <span>ডিভাইস গ্যালারি বা মেমোরি থেকে সিলেক্ট করুন</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 50-LEVEL REFERRAL CHAIN & VIP REWARD CARD */}
      <div 
        onClick={() => setIsReferralModalOpen(true)}
        className="p-5 rounded-3xl bg-slate-900 border-2 border-amber-500/30 hover:border-amber-500/60 shadow-xl space-y-3.5 relative overflow-hidden cursor-pointer group transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Crown className="w-4 h-4 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                <span>৫০-লেভেল রেফারেল চেইন</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-[10px] text-amber-300/80 font-medium">
                লেভেল ৫০ অর্জনে ৬ মাসের ফ্রি VIP মেম্বারশিপ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-all">
            <span className="hidden sm:inline">ট্রি দেখুন</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Level 50 Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">
              অগ্রগতি: <strong className="text-indigo-400 font-mono">লেভেল {referralState.currentLevel} / ৫০</strong>
            </span>
            <span className="text-amber-400 font-mono font-black">{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-500 shadow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Action & Stats Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>টিম মেম্বার: <strong className="text-slate-200 font-mono">{referralState.totalMembers} জন</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyReferralLink}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-indigo-400" />
                  <span>রেফার লিংক</span>
                </>
              )}
            </button>

            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black">
              {referralState.vip6MonthsClaimed ? 'VIP সক্রিয় 👑' : '৬ মাস VIP'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. STATS OVERVIEW CARD */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <Layers className="w-4.5 h-4.5 text-indigo-400" />
          <span>লেনদেন ও সঞ্চয় সামারি (Summary)</span>
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase">মোট এন্ট্রি</span>
            <p className="text-sm font-black text-indigo-400">{transactionCount}</p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase">মোট খরচ</span>
            <p className="text-sm font-black text-rose-400">₹{totalExpense.toLocaleString('en-IN')}</p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase">মোট ব্যালেন্স</span>
            <p className="text-sm font-black text-emerald-400">₹{balance.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* 4. SECURITY & AUTHENTICATION SETTINGS */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
            <span>নিরাপত্তা ও বায়োমেট্রিক সেটিংস</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-900/50">
            SSL ইনক্রিপ্টেড
          </span>
        </div>

        <div className="space-y-3">
          {/* A. Biometric / Fingerprint Unlock Toggle (Inside Profile) */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                isBiometricEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">ফিঙ্গারপ্রিন্ট / বায়োমেট্রিক লগইন</span>
                  {isBiometricEnabled ? (
                    <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded text-[9px] font-black">
                      চালু আছে
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 bg-slate-900 text-slate-500 border border-slate-800 rounded text-[9px] font-bold">
                      বন্ধ
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  অ্যাপ আনলক করার সময় ফিঙ্গারপ্রিন্ট সেন্সর ব্যবহার করুন
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => onToggleBiometric(!isBiometricEnabled)}
              aria-label="Toggle Biometric"
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer shrink-0 border ${
                isBiometricEnabled
                  ? 'bg-indigo-600 border-indigo-400 justify-end'
                  : 'bg-slate-900 border-slate-750 justify-start'
              } flex items-center`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isBiometricEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* B. Secret 4-Digit PIN Management */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">৪-সংখ্যার সিক্রেট পিন</span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                    ••••
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  অ্যাপ আনলক ও জরুরি ভেরিফিকেশনে ব্যবহৃত পিন
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChangePinOpen(true)}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
            >
              পিন পরিবর্তন
            </button>
          </div>

          {/* C. Lock App screen trigger */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-850">
            <div>
              <span className="text-xs font-bold text-slate-200 block">অ্যাপ লক করুন (Lock Screen)</span>
              <p className="text-[10px] text-slate-500 leading-normal">সাময়িকভাবে লক করে পাসকোড বা ফিঙ্গারপ্রিন্ট স্ক্রিন চালু করুন</p>
            </div>
            <button
              type="button"
              onClick={onLockApp}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-300 hover:text-white rounded-xl text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>লক স্ক্রিন</span>
            </button>
          </div>

          {/* D. Premium Membership details */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-850">
            <div>
              <span className="text-xs font-bold text-slate-200 block">প্রিমিয়াম অ্যাকাউন্ট স্ট্যাটাস</span>
              <p className="text-[10px] text-slate-500 leading-normal">
                {isPremium ? 'আপনি ইতিমধ্যে VIP মেম্বার!' : '৫০-লেভেল রেফারেল অথবা সরাসরি VIP আপগ্রেড করুন'}
              </p>
            </div>

            {isPremium ? (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-xl border border-amber-800/50 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 fill-amber-400/25 text-amber-400" />
                <span>ACTIVE VIP</span>
              </span>
            ) : (
              <button
                onClick={onOpenPremium}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-lg shadow-amber-500/15 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Go VIP Pro</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logout button row */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-400 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Daily Expense থেকে লগআউট করুন</span>
        </button>
      </div>

      {/* 50-Level Referral Chain & Reward Modal */}
      <ReferralChainModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        userId={currentUser.email}
        userName={currentUser.name}
        userEmail={currentUser.email}
        isPremium={isPremium}
        onRewardClaimed={() => {
          setReferralState(getReferralNetwork(currentUser.email, currentUser.name));
        }}
      />

      {/* Change 4-Digit PIN Modal */}
      <ChangePinModal
        isOpen={isChangePinOpen}
        user={currentUser}
        onClose={() => setIsChangePinOpen(false)}
        onPinChanged={(newPin) => {
          onUpdatePin(newPin);
          setIsChangePinOpen(false);
        }}
      />
    </div>
  );
}
