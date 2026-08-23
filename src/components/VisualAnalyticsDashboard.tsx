import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CategoryItem } from '../data/categories';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Layers,
  Crown,
  Lock,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface VisualAnalyticsDashboardProps {
  transactions: Transaction[];
  categories: CategoryItem[];
  isPremium: boolean;
  onOpenPremium: () => void;
}

const PALETTE = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#84cc16', // Lime
  '#a855f7', // Purple
  '#64748b'  // Slate
];

export function VisualAnalyticsDashboard({
  transactions,
  categories,
  isPremium,
  onOpenPremium
}: VisualAnalyticsDashboardProps) {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('month');

  // Filter by time and type
  const filteredTransactions = transactions.filter((tx) => {
    if (tx.type !== txType) return false;
    if (timeFilter === 'all') return true;

    const txDate = new Date(tx.date || Date.now());
    const now = new Date();
    if (timeFilter === 'month') {
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    }
    if (timeFilter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txDate >= oneWeekAgo;
    }
    return true;
  });

  const totalSum = filteredTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  // Group by category
  const breakdownMap: Record<string, { amount: number; count: number; categoryObj?: CategoryItem }> = {};
  filteredTransactions.forEach((tx) => {
    if (!breakdownMap[tx.category]) {
      const categoryObj = categories.find((c) => c.name === tx.category);
      breakdownMap[tx.category] = { amount: 0, count: 0, categoryObj };
    }
    breakdownMap[tx.category].amount += Number(tx.amount || 0);
    breakdownMap[tx.category].count += 1;
  });

  const categoryData = Object.entries(breakdownMap)
    .map(([name, data], idx) => ({
      name,
      ...data,
      color: PALETTE[idx % PALETTE.length],
      percentage: totalSum > 0 ? Math.round((data.amount / totalSum) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // SVG Donut calculation
  let accumulatedAngle = 0;
  const donutSlices = categoryData.map((cat) => {
    const angle = (cat.amount / (totalSum || 1)) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;
    return {
      ...cat,
      startAngle,
      angle
    };
  });

  // Helper for SVG donut slice path
  const createDonutSlice = (startAngle: number, angle: number, radius = 40, innerRadius = 26) => {
    if (angle >= 360) {
      // Full circle
      return `M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 M 50 24 A 26 26 0 1 1 50 76 A 26 26 0 1 1 50 24 Z`;
    }
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = (((startAngle + angle) - 90) * Math.PI) / 180;

    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);

    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const maxCategoryAmount = Math.max(...categoryData.map((c) => c.amount), 1);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 relative overflow-hidden">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
              <span>গ্রাফিক্যাল এনালাইসিস ও ড্যাশবোর্ড</span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Crown className="w-2.5 h-2.5 fill-amber-300" />
                VIP PRO
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">ক্যাটাগরি ও সময়ের ভিত্তিতে খরচের চার্ট</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Donut vs Bar Switch */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setChartType('donut')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === 'donut'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pie/Donut Chart"
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* Type Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTxType('expense')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                txType === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              খরচ
            </button>
            <button
              onClick={() => setTxType('income')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                txType === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              আয়
            </button>
          </div>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-[10px] font-bold outline-none cursor-pointer"
          >
            <option value="month">চলতি মাস</option>
            <option value="week">গত ৭ দিন</option>
            <option value="all">সর্বমোট হিসাব</option>
          </select>
        </div>
      </div>

      {/* Main Graphical Canvas / Chart View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Visual Chart Rendering (Donut / Bar) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
          {categoryData.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Layers className="w-10 h-10 mx-auto text-slate-700 stroke-[1.5]" />
              <p className="text-xs font-semibold">কোনো লেনদেন রেকর্ড পাওয়া যায়নি</p>
            </div>
          ) : chartType === 'donut' ? (
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                {donutSlices.map((slice, idx) => (
                  <path
                    key={idx}
                    d={createDonutSlice(slice.startAngle, slice.angle)}
                    fill={slice.color}
                    className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                  >
                    <title>{`${slice.name}: ₹${slice.amount} (${slice.percentage}%)`}</title>
                  </path>
                ))}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {txType === 'expense' ? 'মোট খরচ' : 'মোট আয়'}
                </span>
                <span className={`text-base font-black ${txType === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ₹{totalSum.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">
                  {categoryData.length} টি ক্যাটাগরি
                </span>
              </div>
            </div>
          ) : (
            /* Bar Chart View */
            <div className="w-full space-y-2.5 py-2">
              {categoryData.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300 truncate max-w-[120px]">{cat.name}</span>
                    <span className="text-slate-100">₹{cat.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-850">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(cat.amount / maxCategoryAmount) * 100}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown Details List */}
        <div className="md:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800/60">
            <span>ক্যাটাগরি ও শতাংশ</span>
            <span>পরিমাণ (INR)</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {categoryData.map((cat, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-850 hover:border-slate-750 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block group-hover:text-white transition">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {cat.count} টি ট্রানজেকশন • {cat.percentage}% ভাগ
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-100 block">
                    ₹{cat.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            ))}

            {categoryData.length === 0 && (
              <div className="py-6 text-center text-slate-500 text-xs">
                নির্বাচিত সময়ের মধ্যে কোনো রেকর্ড নেই
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Paywall Overlay for Free Tier */}
      {!isPremium && (
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-100 flex items-center justify-center gap-1.5">
              <span>গ্রাফিক্যাল চার্ট ও এনালাইসিস লক করা</span>
              <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
            </h4>
            <p className="text-xs text-slate-400 max-w-sm">
              ক্যাটাগরি ভিত্তিক পাই-চার্ট, বার গ্রাফ এবং ফিল্টারিং সুবিধা পেতে VIP Pro-তে আপগ্রেড করুন।
            </p>
          </div>
          <button
            onClick={onOpenPremium}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>মাত্র ₹৯৯ দিয়ে আনলক করুন</span>
          </button>
        </div>
      )}

    </div>
  );
}
