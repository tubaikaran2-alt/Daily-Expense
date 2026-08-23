import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CategoryItem } from '../data/categories';
import { VisualAnalyticsDashboard } from './VisualAnalyticsDashboard';
import { TrendChart } from './TrendChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Crown,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity,
  Filter
} from 'lucide-react';

interface AnalyticsReportsViewProps {
  transactions: Transaction[];
  categories: CategoryItem[];
  isPremium: boolean;
  onOpenPremium: () => void;
  onOpenExport: () => void;
  monthlyLimit?: number;
}

export function AnalyticsReportsView({
  transactions,
  categories,
  isPremium,
  onOpenPremium,
  onOpenExport,
  monthlyLimit = 0
}: AnalyticsReportsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'visual_charts' | 'trends' | 'categories'>('visual_charts');

  // Compute key analytics figures
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Current Month calculations
  const now = new Date();
  const currentMonthTx = transactions.filter((t) => {
    const d = new Date(t.date || Date.now());
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const currentMonthExpense = currentMonthTx
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  // Top spending category
  const expenseByCategory: Record<string, number> = {};
  currentMonthTx
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Number(t.amount || 0);
    });

  const topCategoryEntry = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
  const topCategoryName = topCategoryEntry ? topCategoryEntry[0] : 'কোনোটি নয়';
  const topCategoryAmount = topCategoryEntry ? topCategoryEntry[1] : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Analytics Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-100 tracking-tight">
                অ্যানালিটিক্স ও রিপোর্ট ড্যাশবোর্ড
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              গ্রাফিক্যাল চার্ট, ক্যাটাগরি বিশ্লেষণ এবং ব্যয়ের ট্রেন্ড রিপোর্ট
            </p>
          </div>

          {/* Quick PDF/CSV Export CTA */}
          <button
            onClick={onOpenExport}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>স্টেটমেন্ট ডাউনলোড / PDF</span>
            {!isPremium && <Lock className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>

        {/* High-level KPIs in clean grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">চলতি মাসের খরচ</span>
            <span className="text-sm sm:text-base font-black text-rose-400 block mt-0.5">
              ₹{currentMonthExpense.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">সর্বোচ্চ খরচ ক্যাটাগরি</span>
            <span className="text-xs sm:text-sm font-black text-amber-300 block mt-0.5 truncate">
              {topCategoryName}
            </span>
            {topCategoryAmount > 0 && (
              <span className="text-[10px] text-slate-400">₹{topCategoryAmount.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">মোট সঞ্চয়ের হার</span>
            <span className="text-sm sm:text-base font-black text-emerald-400 block mt-0.5">
              {savingsRate}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">মোট লেনদেন সংখ্যা</span>
            <span className="text-sm sm:text-base font-black text-indigo-300 block mt-0.5">
              {transactions.length} টি
            </span>
          </div>
        </div>
      </div>

      {/* Structured Sub-Tabs for clean switching */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-1">
        <button
          onClick={() => setActiveSubTab('visual_charts')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'visual_charts'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>পাই ও বার চার্ট</span>
        </button>

        <button
          onClick={() => setActiveSubTab('trends')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'trends'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>টাইমলাইন ট্রেন্ড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ক্যাটাগরি লিস্ট</span>
        </button>
      </div>

      {/* Main Analytics Content Sections */}
      {activeSubTab === 'visual_charts' && (
        <div className="space-y-6">
          {/* Pie & Bar Graphical Chart Engine */}
          <VisualAnalyticsDashboard
            transactions={transactions}
            categories={categories}
            isPremium={isPremium}
            onOpenPremium={onOpenPremium}
          />

          {/* Quick Breakdown Summary Card */}
          <CategoryBreakdown
            transactions={transactions}
            categories={categories}
          />
        </div>
      )}

      {activeSubTab === 'trends' && (
        <div className="space-y-6">
          {/* Trend Area Chart */}
          <TrendChart
            transactions={transactions}
            isPremium={isPremium}
            onOpenPremium={onOpenPremium}
          />
        </div>
      )}

      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <CategoryBreakdown
            transactions={transactions}
            categories={categories}
          />
        </div>
      )}

      {/* Future Analytics / Insights Extensibility Slot */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-200">
              পরবর্তী আপডেট: এআই বাজেট প্রেডিকশন ও ট্যাক্স সামারি
            </h4>
            <p className="text-[11px] text-slate-400">
              ভবিষ্যতের ব্যয় ও সেভিংস ট্র্যাক করার নতুন টুলস খুব শীঘ্রই যুক্ত হচ্ছে।
            </p>
          </div>
        </div>
        <button
          onClick={onOpenExport}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition shrink-0 cursor-pointer"
        >
          এক্সপোর্ট রিপোর্ট
        </button>
      </div>
    </div>
  );
}
