import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, HelpCircle, ArrowRightLeft } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  userId: string;
  previousMonthCarryover?: number;
  onApplyCarryover: () => void;
}

export function BalanceCard({
  balance,
  totalIncome,
  totalExpense,
  transactionCount,
  userId,
  previousMonthCarryover,
  onApplyCarryover,
}: BalanceCardProps) {
  const expensePercentage = totalIncome > 0 ? Math.min(Math.round((totalExpense / totalIncome) * 100), 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl w-full">
      {/* Visual decorative bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* User reference and stats */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs min-w-0">
            <Wallet className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium truncate max-w-[170px] sm:max-w-[240px] text-[11px] sm:text-xs">{userId}</span>
          </div>
          <span className="text-[10px] sm:text-xs bg-slate-800/90 text-slate-300 px-2.5 py-0.5 rounded-full font-bold shrink-0 border border-slate-700/50">
            {transactionCount}টি লেনদেন
          </span>
        </div>

        {/* Current Net Balance with Fluid Typography */}
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            মোট ব্যালেন্স (Net Balance)
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="fluid-balance-text font-black tracking-tight text-white break-all">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-500">INR</span>
          </div>
        </div>

        {/* Income / Expense Split Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-800">
          {/* Income block */}
          <div className="flex items-center sm:items-start gap-2 sm:gap-2.5 min-w-0 p-2 sm:p-0 rounded-2xl bg-slate-950/40 sm:bg-transparent border border-slate-850/50 sm:border-none">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">মোট জমা (Income)</p>
              <p className="text-sm sm:text-lg font-black text-slate-100 truncate">
                ₹{totalIncome.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Expense block */}
          <div className="flex items-center sm:items-start gap-2 sm:gap-2.5 min-w-0 p-2 sm:p-0 rounded-2xl bg-slate-950/40 sm:bg-transparent border border-slate-850/50 sm:border-none">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">মোট খরচ (Expense)</p>
              <p className="text-sm sm:text-lg font-black text-slate-100 truncate">
                ₹{totalExpense.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Expense-to-Income gauge bar */}
        {totalIncome > 0 && (
          <div className="pt-3 sm:pt-4 border-t border-slate-800/60">
            <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-slate-400 mb-1.5">
              <span>খরচের অনুপাত (Expense Ratio)</span>
              <span className={expensePercentage > 80 ? 'text-rose-400' : expensePercentage > 50 ? 'text-amber-400' : 'text-emerald-400'}>
                {expensePercentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  expensePercentage > 80 ? 'bg-rose-500' : expensePercentage > 50 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${expensePercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive Prior Month Carryover invitation banner */}
      {previousMonthCarryover && previousMonthCarryover > 0 && (
        <div className="bg-indigo-950/80 border-t border-indigo-500/30 p-3.5 sm:px-5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2 min-w-0">
            <ArrowRightLeft className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-200 leading-normal">
              গত মাসের উদ্বৃত্ত ব্যালেন্স <strong className="text-white">₹{previousMonthCarryover.toLocaleString('en-IN')}</strong> এই মাসের প্রারম্ভিক ব্যালেন্স হিসেবে যোগ করতে চান?
            </p>
          </div>
          <button
            onClick={onApplyCarryover}
            className="self-end sm:self-center px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            যোগ করুন ₹
          </button>
        </div>
      )}
    </div>
  );
}
