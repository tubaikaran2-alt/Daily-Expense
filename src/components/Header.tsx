import React, { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { Lock, LogOut, User, Crown, KeyRound, Sparkles, CheckCircle, Wallet, Bell } from 'lucide-react';
import { NotificationModal, ADMIN_NOTIFICATIONS } from './NotificationModal';

interface HeaderProps {
  currentUser: AuthUser;
  isBiometricEnabled: boolean;
  onLockApp: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  syncSuccessMessage: string | null;
  isPremium: boolean;
  onOpenPremium: () => void;
}

export function Header({
  currentUser,
  isBiometricEnabled,
  onLockApp,
  onLogout,
  onOpenProfile,
  syncSuccessMessage,
  isPremium,
  onOpenPremium,
}: HeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    try {
      const readIdsJSON = localStorage.getItem(`ft3d_read_notifs_${currentUser.email}`);
      const readIds: string[] = readIdsJSON ? JSON.parse(readIdsJSON) : [];
      const unread = ADMIN_NOTIFICATIONS.filter(n => !readIds.includes(n.id)).length;
      setUnreadCount(unread);
    } catch {
      setUnreadCount(ADMIN_NOTIFICATIONS.length);
    }
  }, [currentUser, isNotifOpen]);

  const handleMarkAllAsRead = () => {
    if (!currentUser) return;
    try {
      const allIds = ADMIN_NOTIFICATIONS.map(n => n.id);
      localStorage.setItem(`ft3d_read_notifs_${currentUser.email}`, JSON.stringify(allIds));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 sm:px-5 py-2.5 sm:py-3 transition-all">
      <div className="max-w-xl mx-auto w-full flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/25 shrink-0">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white flex items-center gap-1 sm:gap-1.5 truncate">
              <span className="truncate">Daily Expense</span>
              {isPremium && (
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-500/50 shrink-0">
                  PRO
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* VIP Indicator */}
          {isPremium ? (
            <button
              onClick={onOpenPremium}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-bold transition-all hover:bg-amber-500/20 shrink-0 cursor-pointer"
              title="আপনি একজন প্রিমিয়াম মেম্বার"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-400/20" />
              <span className="hidden xs:inline sm:inline">VIP</span>
            </button>
          ) : (
            <button
              onClick={onOpenPremium}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[11px] sm:text-xs font-black transition-all hover:brightness-110 shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span className="whitespace-nowrap">Go VIP</span>
            </button>
          )}

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white transition-all border border-slate-700/50 relative cursor-pointer active:scale-95 shrink-0"
            title="নোটিফিকেশন ও আপডেট"
            aria-label="নোটিফিকেশন"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
            )}
          </button>

          {/* Lock App */}
          {isBiometricEnabled && (
            <button
              onClick={onLockApp}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white transition-all border border-slate-700/50 cursor-pointer active:scale-95 shrink-0"
              title="লক করুন"
              aria-label="লক করুন"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-0.5 sm:p-1 sm:pr-2.5 rounded-full bg-slate-800/90 hover:bg-slate-750 transition-all border border-slate-700/50 text-left cursor-pointer active:scale-95 shrink-0"
            aria-label="প্রোফাইল"
          >
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white uppercase shrink-0">
                {currentUser.name.slice(0, 1)}
              </div>
            )}
            <span className="text-xs font-semibold text-slate-200 max-w-[65px] truncate hidden md:inline">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-all border border-slate-700/50 cursor-pointer active:scale-95 shrink-0"
            title="লগআউট"
            aria-label="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Success Notification Toast */}
      {syncSuccessMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-11/12 max-w-xs z-50 animate-bounce">
          <div className="bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-tight">{syncSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Admin Announcements Notification Modal */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onMarkAllAsRead={handleMarkAllAsRead}
        unreadCount={unreadCount}
      />
    </header>
  );
}
