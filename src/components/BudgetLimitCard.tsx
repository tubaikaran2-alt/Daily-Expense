import React, { useState } from 'react';
import { PiggyBank, Edit2, Check, AlertTriangle, AlertCircle, X, BellRing } from 'lucide-react';

interface BudgetLimitCardProps {
  currentMonthExpense: number;
  monthlyLimit: number | null;
  onUpdateLimit: (limit: number | null) => void;
}

export function BudgetLimitCard({
  currentMonthExpense,
  monthlyLimit,
  onUpdateLimit,
}: BudgetLimitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState<string>(monthlyLimit ? String(monthlyLimit) : '');
  const [error, setError] = useState<string | null>(null);

  const hasLimit = monthlyLimit !== null && monthlyLimit > 0;
  const progressPercent = hasLimit ? Math.min(Math.round((currentMonthExpense / monthlyLimit) * 100), 100) : 0;
  const isOverLimit = hasLimit && currentMonthExpense > monthlyLimit;
  const isWarningLimit = hasLimit && currentMonthExpense >= monthlyLimit * 0.8 && currentMonthExpense <= monthlyLimit;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = tempLimit.trim();
    if (val === '') {
      onUpdateLimit(null);
      setIsEditing(false);
      setError(null);
      return;
    }

    const parsedNum = Number(val);
    if (isNaN(parsedNum) || parsedNum <= 0) {
      setError('দয়া করে একটি সঠিক সংখ্যা লিখুন');
      return;
    }

    onUpdateLimit(parsedNum);
    setIsEditing(false);
    setError(null);
  };

  const handleQuickSet = (amount: number) => {
    setTempLimit(String(amount));
    onUpdateLimit(amount);
    setIsEditing(false);
    setError(null);
  };

  const handleClear = () => {
    setTempLimit('');
    onUpdateLimit(null);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-slate-900 border transition-all duration-300 shadow-xl ${
      isOverLimit 
        ? 'border-rose-500/50 shadow-rose-950/20 ring-1 ring-rose-500/20' 
        : isWarningLimit 
          ? 'border-amber-500/40 shadow-amber-950/10' 
          : 'border-slate-800'
    }`}>
      {/* Dynamic background glow based on budget status */}
      {isOverLimit && (
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      )}
      {isWarningLimit && (
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl shrink-0 ${
              isOverLimit 
                ? 'bg-rose-500/10 text-rose-400' 
                : isWarningLimit 
                  ? 'bg-amber-500/10 text-amber-400' 
                  : 'bg-indigo-500/10 text-indigo-400'
            }`}>
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                মাসিক খরচ বাজেট (Monthly Budget)
              </h3>
              <p className="text-[10px] text-slate-500">চলতি মাসের সর্বোচ্চ খরচের লিমিট</p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                setTempLimit(monthlyLimit ? String(monthlyLimit) : '');
                setIsEditing(true);
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Edit2 className="w-3 h-3" />
              <span>{hasLimit ? 'বদল করুন' : 'বাজেট সেট করুন'}</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 pt-1">
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-0">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="বাজেটের পরিমাণ দিন (উদাঃ ১০০০০)"
                  value={tempLimit}
                  onChange={(e) => {
                    setTempLimit(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl py-2.5 pl-8 pr-4 text-xs sm:text-sm font-bold outline-none transition-all placeholder:text-slate-600"
                  autoFocus
                />
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all active:scale-95 cursor-pointer touch-target flex items-center justify-center"
                  title="সংরক্ষণ করুন"
                  aria-label="সংরক্ষণ করুন"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95 cursor-pointer touch-target flex items-center justify-center"
                  title="বাতিল করুন"
                  aria-label="বাতিল করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && <p className="text-[11px] font-medium text-rose-400">{error}</p>}

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 items-center pt-1">
              <span className="text-[10px] text-slate-500 font-medium">কুইক বাজেট:</span>
              {[5000, 10000, 20000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickSet(amt)}
                  className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-750 text-slate-300 rounded-lg text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
              {hasLimit && (
                <button
                  key="clear"
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-950/80 text-rose-400 rounded-lg text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                >
                  বাতিল করুন
                </button>
              )}
            </div>
          </form>
        ) : (
          <div>
            {!hasLimit ? (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 border-dashed text-center">
                <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
                  আপনি এই মাসের খরচের বাজেট সীমা সেট করেননি। বাজেট সেট করে আপনি অতিরিক্ত খরচ করার প্রবণতা নিয়ন্ত্রণ করতে পারেন।
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 hover:text-white rounded-xl border border-indigo-500/20 text-xs font-bold transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>লিমিট সেট করুন</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-3.5">
                {/* Stats layout */}
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <div className="min-w-0">
                    <span className="text-xl sm:text-2xl font-black text-white">
                      ₹{currentMonthExpense.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 ml-1.5">খরচ হয়েছে</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                      বাজেট: <strong className="text-slate-200">₹{monthlyLimit.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>বাজেট প্রোগ্রেস (Budget Progress)</span>
                    <span className={
                      isOverLimit 
                        ? 'text-rose-400 animate-pulse' 
                        : isWarningLimit 
                          ? 'text-amber-400' 
                          : 'text-indigo-400'
                    }>
                      {isOverLimit ? '১০০% এর বেশি!' : `${progressPercent}%`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverLimit 
                          ? 'bg-rose-500 shadow-lg shadow-rose-500/50 animate-pulse' 
                          : isWarningLimit 
                            ? 'bg-amber-500' 
                            : 'bg-indigo-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Overlimit Warning / Highlight Block */}
                {isOverLimit && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-2.5 animate-pulse">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-rose-500 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black">বাজেট অতিক্রম করেছে! (Over Limit)</p>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                        আপনি আপনার বাজেট লিমিট থেকে <strong className="text-rose-400 font-bold">₹{(currentMonthExpense - monthlyLimit).toLocaleString('en-IN')}</strong> বেশি খরচ করে ফেলেছেন! খরচ নিয়ন্ত্রণ করুন।
                      </p>
                    </div>
                  </div>
                )}

                {/* Warning Warning Block */}
                {isWarningLimit && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-400 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black">বাজেট সীমার কাছাকাছি! (Warning)</p>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                        আপনার বাজেট লিমিটের মাত্র <strong className="text-amber-400 font-bold">₹{(monthlyLimit - currentMonthExpense).toLocaleString('en-IN')}</strong> বাকি আছে। ভেবেচিন্তে খরচ করুন।
                      </p>
                    </div>
                  </div>
                )}

                {/* Safe limit message */}
                {!isOverLimit && !isWarningLimit && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">চলতি মাসে আপনি এখনও বাজেটের নিরাপদ সীমায় রয়েছেন।</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
