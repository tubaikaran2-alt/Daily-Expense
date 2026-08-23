import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CategoryItem } from '../data/categories';
import { Layers, PieChart, TrendingDown, TrendingUp } from 'lucide-react';

interface CategoryBreakdownProps {
  transactions: Transaction[];
  categories: CategoryItem[];
}

export function CategoryBreakdown({ transactions, categories }: CategoryBreakdownProps) {
  const [activeType, setActiveType] = useState<TransactionType>('expense');

  // Filter transactions of active type
  const typeTransactions = transactions.filter((t) => t.type === activeType);
  const totalSum = typeTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

  // Group transactions by category name
  const breakdownMap: Record<string, { amount: number; count: number; categoryObj?: CategoryItem }> = {};

  typeTransactions.forEach((tx) => {
    if (!breakdownMap[tx.category]) {
      const categoryObj = categories.find((c) => c.name === tx.category);
      breakdownMap[tx.category] = { amount: 0, count: 0, categoryObj };
    }
    breakdownMap[tx.category].amount += Number(tx.amount);
    breakdownMap[tx.category].count += 1;
  });

  // Sort breakdown by aggregate amount descending
  const sortedBreakdown = Object.entries(breakdownMap)
    .map(([categoryName, data]) => ({
      categoryName,
      ...data,
      percentage: totalSum > 0 ? Math.round((data.amount / totalSum) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      {/* Header with Type Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>ক্যাটাগরি ভিত্তিক এনালাইসিস</span>
        </h3>

        {/* Small tabs */}
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-850 self-start sm:self-auto">
          <button
            onClick={() => setActiveType('expense')}
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
              activeType === 'expense'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            খরচ (Expense)
          </button>
          <button
            onClick={() => setActiveType('income')}
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
              activeType === 'income'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            আয় (Income)
          </button>
        </div>
      </div>

      {/* Breakdown List */}
      {sortedBreakdown.length === 0 ? (
        <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <PieChart className="w-8 h-8 text-slate-700 stroke-[1.5]" />
          <p className="text-xs font-semibold">কোনো ক্যাটাগরি রেকর্ড খুঁজে পাওয়া যায়নি!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
          {sortedBreakdown.map((item, idx) => {
            const colorClass = item.categoryObj?.color || 'indigo';
            
            // Custom Tailwind color matching
            const colorMap: Record<string, string> = {
              rose: 'bg-rose-500 text-rose-400 border-rose-500/20',
              amber: 'bg-amber-500 text-amber-400 border-amber-500/20',
              blue: 'bg-blue-500 text-blue-400 border-blue-500/20',
              red: 'bg-red-500 text-red-400 border-red-500/20',
              orange: 'bg-orange-500 text-orange-400 border-orange-500/20',
              fuchsia: 'bg-fuchsia-500 text-fuchsia-400 border-fuchsia-500/20',
              pink: 'bg-pink-500 text-pink-400 border-pink-500/20',
              purple: 'bg-purple-500 text-purple-400 border-purple-500/20',
              slate: 'bg-slate-500 text-slate-400 border-slate-500/20',
              emerald: 'bg-emerald-500 text-emerald-400 border-emerald-500/20',
              teal: 'bg-teal-500 text-teal-400 border-teal-500/20',
              cyan: 'bg-cyan-500 text-cyan-400 border-cyan-500/20',
              sky: 'bg-sky-500 text-sky-400 border-sky-500/20',
              violet: 'bg-violet-500 text-violet-400 border-violet-500/20',
              indigo: 'bg-indigo-500 text-indigo-400 border-indigo-500/20',
            };

            const selectedColor = colorMap[colorClass] || colorMap['indigo'];

            return (
              <div key={idx} className="space-y-1.5 group">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${selectedColor.split(' ')[0]}`} />
                    <span className="text-slate-200">{item.categoryName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({item.count} বার)</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-100">₹{item.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 font-extrabold">{item.percentage}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${selectedColor.split(' ')[0]}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Aggregate Footnote Summary */}
      {sortedBreakdown.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>মোট ক্যাটাগরিভুক্ত হিসাব:</span>
          <span className={activeType === 'expense' ? 'text-rose-400' : 'text-emerald-400'}>
            ₹{totalSum.toLocaleString('en-IN')} INR
          </span>
        </div>
      )}
    </div>
  );
}
