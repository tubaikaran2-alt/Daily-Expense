import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Crown,
  Share2,
  Copy,
  Check,
  Users,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Gift,
  Zap,
  CheckCircle2,
  Lock,
  MessageCircle,
  PlusCircle,
  Network,
  ListOrdered,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ReferralNetworkState,
  getReferralNetwork,
  saveReferralNetwork,
  claimLevel50VipReward,
  addReferralMember,
  simulateLevelJump,
  getShareUrl,
  getShareMessage,
} from '../utils/referralService';

interface ReferralChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userEmail: string;
  isPremium: boolean;
  onRewardClaimed?: () => void;
}

export function ReferralChainModal({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
  isPremium,
  onRewardClaimed,
}: ReferralChainModalProps) {
  const [networkState, setNetworkState] = useState<ReferralNetworkState>(() =>
    getReferralNetwork(userId, userName)
  );
  const [activeTab, setActiveTab] = useState<'levels' | 'tree' | 'invite'>('levels');
  const [tierFilter, setTierFilter] = useState<'all' | '1-10' | '11-25' | '26-40' | '41-50'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Sync state whenever modal opens or userId changes
  useEffect(() => {
    if (isOpen) {
      setNetworkState(getReferralNetwork(userId, userName));
    }
  }, [isOpen, userId, userName]);

  // Close on Escape key & manage body scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 3000);
  };

  const handleCopyLink = () => {
    const link = getShareUrl(networkState.referralCode);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast('রেফারেল লিংক কপি হয়েছে! 📋');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(networkState.referralCode);
    setCopiedCode(true);
    showToast('রেফারেল কোড কপি হয়েছে! 🏷️');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareMessage(networkState.referralCode, userName));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'Daily Expense - 50 Level Referral Network',
      text: getShareMessage(networkState.referralCode, userName),
      url: getShareUrl(networkState.referralCode),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User dismissed share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  const handleClaimVip = () => {
    const res = claimLevel50VipReward(userId, userEmail);
    if (res.success) {
      setNetworkState(getReferralNetwork(userId, userName));
      showToast(res.message);
      if (onRewardClaimed) onRewardClaimed();
    } else {
      showToast(res.message);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const updated = addReferralMember(userId, newMemberName.trim(), Math.min(50, networkState.currentLevel + 1));
    setNetworkState(updated);
    setNewMemberName('');
    showToast(`নতুন মেম্বার "${newMemberName}" যুক্ত হয়েছে! চেইনে লেভেল বৃদ্ধি পেয়েছে! 🚀`);
  };

  const handleJumpLevel = (targetLevel: number) => {
    const updated = simulateLevelJump(userId, targetLevel);
    setNetworkState(updated);
    showToast(`লেভেল ${targetLevel}-এ সফলভাবে আপগ্রেড করা হয়েছে! 🎯`);
  };

  // Filter levels
  const filteredLevels = networkState.levels.filter((lvl) => {
    if (tierFilter === '1-10') return lvl.level >= 1 && lvl.level <= 10;
    if (tierFilter === '11-25') return lvl.level >= 11 && lvl.level <= 25;
    if (tierFilter === '26-40') return lvl.level >= 26 && lvl.level <= 40;
    if (tierFilter === '41-50') return lvl.level >= 41 && lvl.level <= 50;
    return true;
  });

  const progressPercent = Math.min(100, Math.round((networkState.currentLevel / 50) * 100));

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 select-none animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer transition-opacity"
      />

      {/* Centered Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="z-[10000] w-[94vw] max-w-xl max-h-[88vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 select-text cursor-default"
      >
        {/* Sticky Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner shrink-0">
              <Crown className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
                  ৫০-লেভেল রেফারেল চেইন ও রিওয়ার্ড
                </h2>
              </div>
              <p className="text-[11px] text-slate-400">
                লেভেল ৫০ অর্জনে পান ৬ মাসের ফ্রি VIP মেম্বারশিপ
              </p>
            </div>
          </div>

          {/* Close X */}
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
          {/* Toast alert */}
          {statusToast && (
            <div className="p-3 bg-indigo-600/90 text-white text-xs font-bold rounded-2xl shadow-lg animate-fade-in flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-300 fill-amber-300" />
              <span>{statusToast}</span>
            </div>
          )}

          {/* 1. HERO LEVEL 50 VIP REWARD CARD */}
          <div className="relative p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border-2 border-amber-500/40 shadow-xl overflow-hidden space-y-3">
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-bl-2xl shadow">
              GRAND PRIZE
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 fill-amber-400/30" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                  ৬ মাসের ফ্রি ভিআইপি সাবস্ক্রিপশন
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-xs text-amber-300/90 font-medium">
                  6-Month Free VIP Membership at Level 50
                </p>
              </div>
            </div>

            {/* Progress Bar towards Level 50 */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">
                  বর্তমান অগ্রগতি:{' '}
                  <strong className="text-indigo-400 font-mono text-sm">
                    লেভেল {networkState.currentLevel}/৫০
                  </strong>
                </span>
                <span className="text-amber-400 font-mono font-black">{progressPercent}% সম্পন্ন</span>
              </div>

              <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-500 shadow"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Reward Action / Claim Trigger */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300">
                  মোট নেটওয়ার্ক মেম্বার: <strong className="text-indigo-400 font-mono">{networkState.totalMembers} জন</strong>
                </span>
              </div>

              {networkState.vip6MonthsClaimed ? (
                <span className="px-3 py-1 bg-emerald-950 border border-emerald-800/60 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VIP সক্রিয় রয়েছে 👑</span>
                </span>
              ) : networkState.currentLevel >= 50 ? (
                <button
                  type="button"
                  onClick={handleClaimVip}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 animate-bounce"
                >
                  <Gift className="w-4 h-4" />
                  <span>৬ মাসের ফ্রি VIP ক্লেইম করুন!</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  আরও {50 - networkState.currentLevel} টি লেভেল বাকি
                </span>
              )}
            </div>
          </div>

          {/* 2. REFERRAL CODE & SHARING BOX */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                আপনার রেফারেল কোড ও লিংক
              </span>
              <div className="flex items-center gap-1 font-mono font-black text-xs text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-900/50">
                <span>{networkState.referralCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 hover:text-white transition-all cursor-pointer"
                  title="কোড কপি করুন"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Link & Social Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-850 active:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>লিংক কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-indigo-400" />
                    <span>রেফারেল লিংক কপি করুন</span>
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 active:bg-emerald-600/40 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
                  <span>WhatsApp-এ শেয়ার</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="px-3 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 active:bg-indigo-600/40 border border-indigo-500/40 rounded-xl text-indigo-400 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                  title="শেয়ার করুন"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. TABS NAVIGATION */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850">
            <button
              type="button"
              onClick={() => setActiveTab('levels')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'levels'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>৫০-টি লেভেল তালিকা</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tree')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'tree'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>রেফারেল ট্রি (Tree)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('invite')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'invite'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>লেভেল আপ টেস্ট</span>
            </button>
          </div>

          {/* TAB 1: 50-LEVEL LIST */}
          {activeTab === 'levels' && (
            <div className="space-y-3">
              {/* Tier Filter Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'সব লেভেল (১-৫০)' },
                  { id: '1-10', label: 'লেভেল ১-১০' },
                  { id: '11-25', label: 'লেভেল ১১-২৫' },
                  { id: '26-40', label: 'লেভেল ২৬-৪০' },
                  { id: '41-50', label: 'লেভেল ৪১-৫০ (VIP)' },
                ].map((tf) => (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setTierFilter(tf.id as any)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      tierFilter === tf.id
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                        : 'bg-slate-950 text-slate-400 border border-slate-850 hover:border-slate-700'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Levels Scroll Grid */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredLevels.map((lvl) => {
                  const isCurrent = lvl.level === networkState.currentLevel;
                  const isCompleted = lvl.level <= networkState.currentLevel;
                  const isLevel50 = lvl.level === 50;

                  return (
                    <div
                      key={lvl.level}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isLevel50
                          ? 'bg-amber-950/30 border-amber-500/40 shadow-sm'
                          : isCurrent
                          ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm'
                          : isCompleted
                          ? 'bg-slate-950 border-slate-800'
                          : 'bg-slate-950/50 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black font-mono shrink-0 border ${
                            isLevel50
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : isCompleted
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {lvl.level}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-200">
                              {lvl.titleBn}
                            </h4>
                            {isCurrent && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-indigo-500 text-white">
                                বর্তমান লেভেল
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            রিওয়ার্ড:{' '}
                            <strong className={isLevel50 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                              {lvl.rewardTierBn}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>আনলকড</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                            <Lock className="w-3.5 h-3.5" />
                            <span>লকড</span>
                          </div>
                        )}
                        <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                          {lvl.memberCount} মেম্বার
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE REFERRAL TREE */}
          {activeTab === 'tree' && (
            <div className="space-y-4 p-2">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl text-center space-y-3">
                {/* Root Node (Current User) */}
                <div className="inline-flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 border-2 border-indigo-400 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-600/30">
                    {userName ? userName.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div className="mt-1">
                    <p className="text-xs font-black text-slate-100">{userName} (You)</p>
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-900/50">
                      লেভেল {networkState.currentLevel} রুট
                    </span>
                  </div>
                </div>

                {/* Connecting lines */}
                <div className="w-0.5 h-6 bg-indigo-500/50 mx-auto" />

                {/* Generation 1 Direct Nodes */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    ১ম লেভেল সরাসরি রেফারেল শাখা (Direct Branches)
                  </span>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {networkState.recentMembers.slice(0, 3).map((mem, idx) => (
                      <div
                        key={mem.id}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center min-w-[95px] space-y-1"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center mx-auto border border-emerald-500/30">
                          {mem.name.slice(0, 1)}
                        </div>
                        <p className="text-[10px] font-bold text-slate-200 truncate">{mem.name}</p>
                        <span className="text-[8px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-900/40 block">
                          লেভেল {mem.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connecting lines to deeper tiers */}
                <div className="w-0.5 h-6 bg-slate-700 mx-auto" />

                {/* Deep 50-Level Chain Summary Node */}
                <div className="p-3 bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-800/40 rounded-2xl max-w-sm mx-auto text-left flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>৫০-লেভেল সাব-চেইন ডেপথ</span>
                    </span>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">
                      মোট {networkState.totalMembers} জন মেম্বার সংযুক্ত
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-400 font-mono">
                      Tier 1 ➔ Tier 50
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVITE & SIMULATE LEVEL UP */}
          {activeTab === 'invite' && (
            <div className="space-y-4">
              {/* Add Direct Member Form */}
              <form onSubmit={handleAddMember} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  নতুন রেফারেল মেম্বার যোগ করুন (Add Referral Partner)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="মেম্বারের নাম লিখুন (e.g. Tanmoy Roy)"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer shadow"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </form>

              {/* Instant Level Simulation Buttons for Testing Level 50 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-400/20" />
                  <span>লেভেল আপ ফাস্ট-ফরওয়ার্ড ও টেস্ট (Test Level 50 Climb)</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  নিচের বাটনে ক্লিক করে সরাসরি লেভেল বৃদ্ধি করুন এবং লেভেল ৫০-এর ৬ মাসের ফ্রি VIP মেম্বারশিপ আনলক ও ক্লেইম টেস্ট করুন:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleJumpLevel(10)}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer text-center"
                  >
                    লেভেল ১০ (Bronze)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpLevel(25)}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer text-center"
                  >
                    লেভেল ২৫ (Silver)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpLevel(50)}
                    className="col-span-2 sm:col-span-1 py-2 px-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <Crown className="w-3.5 h-3.5 fill-amber-400/20" />
                    <span>লেভেল ৫০ (VIP Unlock)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            বাইরে যেকোনো জায়গায় ক্লিক করে বন্ধ করুন
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer text-center shadow-sm"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
