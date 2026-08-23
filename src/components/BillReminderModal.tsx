import React, { useState, useEffect } from 'react';
import { BillReminder } from '../types';
import {
  CalendarClock,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Crown,
  Sparkles,
  Trash2,
  BellRing,
  RotateCcw
} from 'lucide-react';

interface BillReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  isPremium: boolean;
  onOpenPremium: () => void;
}

const DEFAULT_PRESETS = [
  { title: 'বিদ্যুৎ বিল (Electricity)', category: 'Utilities', amount: 850, recurring: 'monthly' },
  { title: 'ওয়াইফাই / ইন্টারনেট (Broadband)', category: 'Internet', amount: 599, recurring: 'monthly' },
  { title: 'মোবাইল রিচার্জ (Mobile Recharge)', category: 'Recharge', amount: 299, recurring: 'monthly' },
  { title: 'বাসা ভাড়া (House Rent)', category: 'Rent', amount: 6500, recurring: 'monthly' },
  { title: 'ওটিটি / সাবস্ক্রিপশন (OTT Sub)', category: 'Subscription', amount: 199, recurring: 'monthly' },
];

export function BillReminderModal({
  isOpen,
  onClose,
  userId,
  isPremium,
  onOpenPremium
}: BillReminderModalProps) {
  const [reminders, setReminders] = useState<BillReminder[]>(() => {
    try {
      const saved = localStorage.getItem(`ft3d_bills_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default mock data for initial load
    return [
      {
        id: 'bill-1',
        userId,
        title: 'ওয়াইফাই ব্রডব্যান্ড বিল',
        amount: 599,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'Internet',
        isPaid: false,
        recurring: 'monthly'
      },
      {
        id: 'bill-2',
        userId,
        title: 'বিদ্যুৎ বিল (WBSEDCL)',
        amount: 1120,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'Utilities',
        isPaid: false,
        recurring: 'monthly'
      },
      {
        id: 'bill-3',
        userId,
        title: 'মোবাইল রিচার্জ (Jio/Airtel)',
        amount: 299,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'Recharge',
        isPaid: true,
        recurring: 'monthly'
      }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newRecurring, setNewRecurring] = useState<'monthly' | 'yearly' | 'one-time'>('monthly');

  useEffect(() => {
    try {
      localStorage.setItem(`ft3d_bills_${userId}`, JSON.stringify(reminders));
    } catch (e) {
      console.error(e);
    }
  }, [reminders, userId]);

  if (!isOpen) return null;

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium && reminders.length >= 2) {
      onOpenPremium();
      return;
    }

    if (!newTitle.trim() || !newAmount || !newDueDate) return;

    const newBill: BillReminder = {
      id: 'bill-' + Date.now(),
      userId,
      title: newTitle.trim(),
      amount: Number(newAmount),
      dueDate: newDueDate,
      category: 'Bills',
      isPaid: false,
      recurring: newRecurring
    };

    setReminders(prev => [newBill, ...prev]);
    setIsAdding(false);
    setNewTitle('');
    setNewAmount('');
    setNewDueDate('');
  };

  const handleTogglePaid = (id: string) => {
    setReminders(prev =>
      prev.map(item => (item.id === id ? { ...item, isPaid: !item.isPaid } : item))
    );
  };

  const handleDeleteBill = (id: string) => {
    setReminders(prev => prev.filter(item => item.id !== id));
  };

  const getDaysLeftLabel = (dueDateStr: string, isPaid: boolean) => {
    if (isPaid) {
      return { text: 'পরিশোধিত (Paid)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} দিন ওভারডিউ!`, color: 'text-rose-400 bg-rose-950/60 border-rose-500/40 animate-pulse' };
    } else if (diffDays === 0) {
      return { text: 'আজই শেষ তারিখ (Due Today)', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40 animate-pulse' };
    } else if (diffDays === 1) {
      return { text: 'আগামীকাল ডিউ (Tomorrow)', color: 'text-amber-300 bg-amber-950/40 border-amber-500/30' };
    } else {
      return { text: `${diffDays} দিন বাকি (In ${diffDays} days)`, color: 'text-indigo-300 bg-indigo-950/40 border-indigo-500/30' };
    }
  };

  const totalUnpaid = reminders.filter(r => !r.isPaid).reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="border-b border-slate-800/80 px-5 py-4 flex items-center justify-between bg-slate-900 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/25">
              <CalendarClock className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                স্মার্ট বিল রিমাইন্ডার
                <Crown className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
              </h3>
              <p className="text-[10px] text-slate-400">সাবস্ক্রিপশন ও বিলের সময়সূচী ট্র্যাকিং</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                বকেয়া বিল (Pending Total)
              </span>
              <div className="text-lg font-black text-rose-400">
                ₹{totalUnpaid.toLocaleString('en-IN')}
              </div>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>বিল যুক্ত করুন</span>
            </button>
          </div>

          {/* New Bill Form */}
          {isAdding && (
            <form onSubmit={handleAddBill} className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs font-black text-slate-200">নতুন বিল বা রিমাইন্ডার সেট করুন</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  বাতিল
                </button>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1">
                {DEFAULT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewTitle(preset.title);
                      setNewAmount(String(preset.amount));
                    }}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] font-bold text-slate-300 rounded-lg transition-all"
                  >
                    + {preset.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">বিলের নাম (Bill Title)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., বিদ্যুৎ বিল, বাড়ি ভাড়া"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">পরিমাণ (Amount ₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="₹500"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">শেষ তারিখ (Due Date)</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
              >
                রিমাইন্ডার সেভ করুন 🔔
              </button>
            </form>
          )}

          {/* Bill Items List */}
          <div className="space-y-2.5">
            {reminders.map((bill) => {
              const status = getDaysLeftLabel(bill.dueDate, bill.isPaid);
              return (
                <div
                  key={bill.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    bill.isPaid
                      ? 'bg-slate-950/40 border-slate-850/60 opacity-75'
                      : 'bg-slate-950 border-slate-850 hover:border-slate-750'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${bill.isPaid ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {bill.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-white text-xs">₹{bill.amount.toLocaleString('en-IN')}</span>
                      <span>• তারিখ: {bill.dueDate}</span>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTogglePaid(bill.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        bill.isPaid
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={bill.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${bill.isPaid ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </button>

                    <button
                      onClick={() => handleDeleteBill(bill.id)}
                      className="p-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {reminders.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-xs">
                কোনো বিল বা সাবস্ক্রিপশন যুক্ত করা নেই।
              </div>
            )}
          </div>

          {/* VIP Banner if Free */}
          {!isPremium && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-amber-300 block">আনলিমিটেড বিল রিমাইন্ডার</span>
                <p className="text-[9px] text-slate-400">VIP Pro সাবস্ক্রিপশনে সব রিমাইন্ডার আনলক করুন</p>
              </div>
              <button
                onClick={onOpenPremium}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl text-[10px] font-black shadow cursor-pointer active:scale-95"
              >
                আপগ্রেড (₹৯৯)
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
