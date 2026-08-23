import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CategoryItem } from '../data/categories';
import {
  ListFilter,
  Search,
  Trash2,
  AlertCircle,
  XCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: CategoryItem[];
  onDeleteTransaction: (id: string) => void;
  onClearAll: () => void;
}

export function TransactionList({
  transactions,
  categories,
  onDeleteTransaction,
  onClearAll,
}: TransactionListProps) {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);

  // Filter & Search Logic
  const filteredList = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      (tx.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.note || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.amount || '').toString().includes(searchQuery);

    return matchesType && matchesSearch;
  });

  // Handle visible pages
  const displayedList = filteredList.slice(0, visibleCount);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5 sm:space-y-4 w-full">
      {/* Title block & Clear All */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 flex-wrap">
        <h3 className="text-[11px] sm:text-xs font-bold text-slate-300 flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider min-w-0">
          <ListFilter className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">লেনদেন সমূহের বিবরণী (History)</span>
        </h3>

        {transactions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            {confirmClearAll ? (
              <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClearAll(false);
                  }}
                  className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded-lg font-bold transition-all active:scale-95 cursor-pointer shadow-sm flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>নিশ্চিত মুছুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg font-medium transition-all cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded-lg border border-rose-500/20 font-bold transition-all active:scale-95 cursor-pointer"
              >
                সব মুছুন
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="লেনদেন খুজুন (নোট বা ক্যাটাগরি)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Type tabs filter */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
          {(['all', 'expense', 'income'] as const).map((t) => {
            const labels = { all: 'সব', expense: 'খরচ', income: 'আয়' };
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setFilterType(t);
                  setVisibleCount(10); // reset page view
                }}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === t
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions Feed */}
      {filteredList.length === 0 ? (
        <div className="py-10 sm:py-12 text-center text-slate-600 flex flex-col items-center justify-center gap-2 bg-slate-950/40 rounded-2xl border border-slate-850/50 p-4">
          <AlertCircle className="w-8 h-8 sm:w-9 sm:h-9 text-slate-700 stroke-[1.5]" />
          <div>
            <p className="text-xs font-semibold">কোনো লেনদেনের এন্ট্রি পাওয়া যায়নি!</p>
            {transactions.length > 0 && <p className="text-[10px] text-slate-500">সার্চ ফিল্টারটি পরিবর্তন করুন।</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-2.5">
          {displayedList.map((tx) => {
            const isIncome = tx.type === 'income';

            // Find matching category object to get icon details
            const matchedCategory = categories.find((c) => c.name === tx.category);
            const colorClass = matchedCategory?.color || 'indigo';

            const colorTextMap: Record<string, string> = {
              rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
              amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
              blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              red: 'text-red-400 bg-red-500/10 border-red-500/20',
              orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
              fuchsia: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
              pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
              purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
              slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
              emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
              cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
              sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
              violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
              indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
            };

            const selectedClass = colorTextMap[colorClass] || colorTextMap['indigo'];

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all gap-2"
              >
                {/* Left: Category Icon & Note details */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border ${selectedClass}`}>
                    {tx.category ? tx.category.slice(0, 1) : '•'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-100 truncate">
                      {tx.category}
                    </p>
                    {tx.note ? (
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[220px]">
                        {tx.note}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-600 italic">কোনো বিবরণ নেই</p>
                    )}
                  </div>
                </div>

                {/* Right: Amount, Date, Sync Status, Delete Button */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="text-right">
                    <p className={`text-xs sm:text-sm font-black ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {isIncome ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold">
                      {tx.date}
                    </p>
                  </div>

                  {/* Sync Status Icon indicator */}
                  <div title={tx.syncedToSheet ? 'Google Sheet-এ সিঙ্কড' : 'সিঙ্ক করা হয়নি'} className="shrink-0">
                    {tx.syncedToSheet ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>

                  {/* Delete individual row - Instant & Reliable */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTransaction(tx.id);
                    }}
                    className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 active:bg-rose-900/60 border border-slate-800/90 active:scale-90 transition-all cursor-pointer shadow-sm shrink-0"
                    title="এই লেনদেনটি মুছে ফেলুন"
                    aria-label="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {filteredList.length > visibleCount && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + 10)}
          className="w-full py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer active:scale-95"
        >
          পূর্ববর্তী লেনদেন লোড করুন (+১০)
        </button>
      )}
    </div>
  );
}
