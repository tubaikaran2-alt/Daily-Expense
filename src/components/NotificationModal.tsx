import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Check } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  date: string;
  tag: 'update' | 'feature' | 'system' | 'promo';
  tagColor: string;
}

export const ADMIN_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-budget',
    title: 'Monthly Budget Limit Feature Released!',
    titleBn: 'মাসিক বাজেট লিমিট ফিচার রিলিজ!',
    description: 'Track and control your expenses with the new Monthly Budget Limit widget on the dashboard. Get alerts before crossing limits.',
    descriptionBn: 'আপনার খরচ সহজে নিয়ন্ত্রণ করতে ড্যাশবোর্ডে নতুন "মাসিক বাজেট লিমিট" উইজেট যুক্ত করা হয়েছে। বাজেট শেষ হওয়ার পূর্বে নোটিফিকেশন অ্যালার্ট পাবেন।',
    date: '2026-08-22',
    tag: 'feature',
    tagColor: 'bg-indigo-950 text-indigo-400 border-indigo-800/60'
  },
  {
    id: 'notif-sheets',
    title: 'Google Sheets Auto-Sync Stable',
    titleBn: 'গুগল শিট অটো-সিঙ্ক ও সিকিউরিটি আপডেট',
    description: 'We have optimized the multi-user sheets backup system. Your login, expense logs, and reviews are now completely synchronized with zero latency.',
    descriptionBn: 'গুগল শিট ডাটা সিঙ্ক করার প্রক্রিয়া আরও উন্নত করা হয়েছে। এখন আপনার সাইনআপ, অ্যাকাউন্ট রেকর্ড ও রিভিউ আরও দ্রুত স্প্রেডশিটে ব্যাকআপ হবে।',
    date: '2026-08-21',
    tag: 'system',
    tagColor: 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
  },
  {
    id: 'notif-v1',
    title: 'Welcome to Daily Expense Version 1.0.0!',
    titleBn: 'Daily Expense v1.0.0-এ আপনাকে স্বাগতম!',
    description: 'Proudly Made in India. Enjoy a secure, lightning-fast dark-themed dashboard to manage your daily income and savings effortlessly.',
    descriptionBn: 'সম্পূর্ণ ভারতীয় প্রযুক্তিতে তৈরি হিসাব খাতা অ্যাপ্লিকেশনে আপনাকে স্বাগতম। আধুনিক ডার্ক থিম ড্যাশবোর্ডে আপনার দৈনিক ইনকাম ও খরচ সহজে ট্র্যাক করুন।',
    date: '2026-08-20',
    tag: 'update',
    tagColor: 'bg-amber-950 text-amber-400 border-amber-800/60'
  }
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export function NotificationModal({
  isOpen,
  onClose,
  onMarkAllAsRead,
  unreadCount,
}: NotificationModalProps) {
  // Close on Escape key & lock body scroll
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

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      {/* Semi-transparent Backdrop Overlay - Click outside to dismiss */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer transition-opacity"
      />

      {/* Centered Modal Dialog Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="z-[10000] w-[92vw] max-w-md max-h-[82vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 select-text cursor-default"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
                  নোটিফিকেশন ও আপডেট
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 border border-rose-500/40 text-rose-400">
                    {unreadCount} নতুন
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                অ্যাডমিন ও সিস্টেম বার্তা
              </p>
            </div>
          </div>

          {/* Close ('X') Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="নোটিফিকেশন বন্ধ করুন"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unread banner if unread items exist */}
        {unreadCount > 0 && (
          <div className="px-5 py-2.5 bg-indigo-950/40 border-b border-indigo-900/40 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs font-semibold text-indigo-300">
              {unreadCount} টি অপঠিত নোটিফিকেশন
            </span>
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>সব পড়া হয়েছে</span>
            </button>
          </div>
        )}

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5">
          {ADMIN_NOTIFICATIONS.map((notif) => (
            <div 
              key={notif.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-750 transition-all space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${notif.tagColor}`}>
                  {notif.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{notif.date}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-100 leading-snug">
                  {notif.titleBn}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {notif.title}
                </p>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed border-t border-slate-900/90 pt-2 space-y-1">
                <p className="font-normal">{notif.descriptionBn}</p>
                <p className="text-slate-400 italic text-[11px]">{notif.description}</p>
              </div>
            </div>
          ))}
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
