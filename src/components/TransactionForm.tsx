import React, { useState, useEffect } from 'react';
import { CategoryItem } from '../data/categories';
import { TransactionType } from '../types';
import { PlusCircle, Calendar, MessageSquare, IndianRupee, HelpCircle, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  categories: CategoryItem[];
  onSubmitTransaction: (data: {
    type: TransactionType;
    amount: number;
    category: string;
    note: string;
    date: string;
  }) => Promise<void>;
  isSyncing: boolean;
}

export function TransactionForm({ categories, onSubmitTransaction, isSyncing }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Filter categories by selected type (income/expense)
  const filteredCategories = categories.filter((cat) => cat.type === type);

  // Automatically reset selected category when type changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].name);
    } else {
      setCategory('');
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('অনুগ্রহ করে সঠিক টাকার পরিমাণ ইনপুট দিন।');
      return;
    }

    if (!category) {
      alert('অনুগ্রহ করে একটি ক্যাটাগরি সিলেক্ট করুন।');
      return;
    }

    await onSubmitTransaction({
      type,
      amount: parsedAmount,
      category,
      note: note.trim(),
      date
    });

    // Reset fields
    setAmount('');
    setNote('');
  };

  const handleQuickDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 flex-wrap">
        <h3 className="text-xs sm:text-sm font-bold text-slate-200 truncate">নতুন এন্ট্রি যোগ করুন</h3>
        
        {/* Income / Expense Toggle Switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            খরচ (Expense)
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            আয় (Income)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            টাকার পরিমাণ (Amount)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-sm sm:text-base">
              ₹
            </span>
            <input
              type="number"
              required
              min="0.01"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs sm:text-sm font-bold text-slate-100 outline-none transition-all placeholder:text-slate-700"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            ক্যাটাগরি (Category)
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 outline-none transition-all cursor-pointer"
          >
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optional Note / Remarks */}
      <div className="space-y-1.5">
        <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>নোট / বিবরণ (Remarks)</span>
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="যেমন: মাসিক বাজার, বিদ্যুৎ বিল, বোনাস ইত্যাদি..."
          className="w-full px-3.5 sm:px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs sm:text-sm font-medium text-slate-200 outline-none transition-all placeholder:text-slate-700"
        />
      </div>

      {/* Date Selection & Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-end pt-1">
        <div className="space-y-1.5">
          <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>তারিখ (Date)</span>
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 sm:px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 outline-none transition-all cursor-pointer"
          />
        </div>

        {/* Quick Date Presets */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickDate(0)}
            className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
              date === new Date().toISOString().split('T')[0]
                ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            আজ (Today)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate(1)}
            className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-[11px] sm:text-xs font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer active:scale-95"
          >
            গতকাল (Yesterday)
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSyncing}
        className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer ${
          type === 'expense'
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
        } disabled:brightness-75`}
      >
        {isSyncing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>সিঙ্ক ও সেভ হচ্ছে...</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>লেনদেন যুক্ত করুন</span>
          </>
        )}
      </button>
    </form>
  );
}
