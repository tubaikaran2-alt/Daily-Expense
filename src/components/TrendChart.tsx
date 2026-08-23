import React, { useState } from 'react';
import { Transaction } from '../types';
import { LineChart, Lock, Eye, Sparkles, TrendingUp, Calendar } from 'lucide-react';

interface TrendChartProps {
  transactions: Transaction[];
  isPremium: boolean;
  onOpenPremium: () => void;
}

export function TrendChart({ transactions, isPremium, onOpenPremium }: TrendChartProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Generate the last 7 days keys
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  // Aggregate income and expense per day
  const dailyData = last7Days.map((date) => {
    const dayTxs = transactions.filter((t) => t.date === date);
    const income = dayTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = dayTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    
    // Formatting for display label
    const label = new Date(date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
    return { date, label, income, expense };
  });

  // Calculate maximum value to scale SVG coordinates
  const maxVal = Math.max(...dailyData.map((d) => Math.max(d.income, d.expense)), 1000);

  // SVG dimensions
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Helper to map index and value to SVG coordinates
  const getCoords = (index: number, val: number) => {
    const x = paddingX + (index / 6) * chartWidth;
    const ratio = maxVal > 0 ? val / maxVal : 0;
    const y = height - paddingY - ratio * chartHeight;
    return { x, y };
  };

  // Build SVG path data for Income
  const incomePoints = dailyData.map((d, i) => getCoords(i, d.income));
  const incomePath = incomePoints.length > 0
    ? `M ${incomePoints[0].x} ${incomePoints[0].y} ` + incomePoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const incomeAreaPath = incomePoints.length > 0
    ? `${incomePath} L ${incomePoints[incomePoints.length - 1].x} ${height - paddingY} L ${incomePoints[0].x} ${height - paddingY} Z`
    : '';

  // Build SVG path data for Expense
  const expensePoints = dailyData.map((d, i) => getCoords(i, d.expense));
  const expensePath = expensePoints.length > 0
    ? `M ${expensePoints[0].x} ${expensePoints[0].y} ` + expensePoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const expenseAreaPath = expensePoints.length > 0
    ? `${expensePath} L ${expensePoints[expensePoints.length - 1].x} ${height - paddingY} L ${expensePoints[0].x} ${height - paddingY} Z`
    : '';

  const activeDay = selectedDayIndex !== null ? dailyData[selectedDayIndex] : null;

  return (
    <div className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden p-5">
      {/* Chart Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <LineChart className="w-4 h-4 text-indigo-400" />
          <span>৭ দিনের সাপ্তাহিক গতিধারা (Weekly Trend)</span>
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500" />
            <span className="text-slate-400">আয় (Income)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 border border-rose-500" />
            <span className="text-slate-400">খরচ (Expense)</span>
          </div>
        </div>
      </div>

      {/* SVG Trend Container */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + ratio * chartHeight;
            const gridVal = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  className="text-[9px] font-bold font-mono"
                >
                  ৳{gridVal >= 1000 ? `${(gridVal / 1000).toFixed(1)}k` : gridVal}
                </text>
              </g>
            );
          })}

          {/* Income Paths */}
          {incomePath && (
            <>
              {/* Fill area */}
              <path d={incomeAreaPath} fill="url(#incomeGrad)" className="transition-all duration-300" />
              {/* Stroke line */}
              <path
                d={incomePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            </>
          )}

          {/* Expense Paths */}
          {expensePath && (
            <>
              {/* Fill area */}
              <path d={expenseAreaPath} fill="url(#expenseGrad)" className="transition-all duration-300" />
              {/* Stroke line */}
              <path
                d={expensePath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            </>
          )}

          {/* Interactive vertical hover lines and markers */}
          {dailyData.map((d, i) => {
            const incPoint = getCoords(i, d.income);
            const expPoint = getCoords(i, d.expense);
            const isHovered = selectedDayIndex === i;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setSelectedDayIndex(i)}
                onMouseLeave={() => setSelectedDayIndex(null)}
                onClick={() => setSelectedDayIndex(selectedDayIndex === i ? null : i)}
              >
                {/* Transparent vertical strip for easier hover */}
                <rect
                  x={paddingX + (i / 6) * chartWidth - chartWidth / 12}
                  y={paddingY}
                  width={chartWidth / 6}
                  height={chartHeight}
                  fill="transparent"
                />

                {isHovered && (
                  <line
                    x1={incPoint.x}
                    y1={paddingY}
                    x2={incPoint.x}
                    y2={height - paddingY}
                    stroke="#4f46e5"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Income point marker */}
                <circle
                  cx={incPoint.x}
                  cy={incPoint.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#10b981"
                  stroke="#020617"
                  strokeWidth={isHovered ? 1.5 : 1}
                  className="transition-all"
                />

                {/* Expense point marker */}
                <circle
                  cx={expPoint.x}
                  cy={expPoint.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#f43f5e"
                  stroke="#020617"
                  strokeWidth={isHovered ? 1.5 : 1}
                  className="transition-all"
                />
              </g>
            );
          })}

          {/* X Axis Labels */}
          {dailyData.map((d, i) => {
            const x = paddingX + (i / 6) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={height - paddingY + 12}
                textAnchor="middle"
                fill="#64748b"
                className="text-[9px] font-extrabold"
              >
                {d.label}
              </text>
            );
          })}

          {/* Gradient Grids Definitions */}
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Dynamic Tooltip */}
        {activeDay && (
          <div className="mt-3 bg-slate-950/95 border border-slate-800 p-3 rounded-2xl flex flex-col gap-1.5 shadow-2xl animate-fade-in">
            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-400" />
              {activeDay.label} (পূর্ণাঙ্গ বিবরণ)
            </span>
            <div className="flex justify-between items-center text-xs gap-4">
              <span className="text-emerald-400 font-extrabold">আয়: ৳{activeDay.income.toLocaleString('bn-BD')}</span>
              <span className="text-rose-400 font-extrabold">খরচ: ৳{activeDay.expense.toLocaleString('bn-BD')}</span>
            </div>
          </div>
        )}
      </div>

      {/* VIP Premium Blocker Cover Overlay */}
      {!isPremium && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2.5 animate-pulse">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-slate-100 flex items-center gap-1.5 mb-1">
            গতিধারা ও এনালাইটিক্স চার্ট লকড!
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </h4>
          <p className="text-xs text-slate-400 max-w-[280px] mb-4 leading-relaxed">
            সাপ্তাহিক ও মাসিক খরচের গ্রাফিকাল গতিধারা আনলক করতে এবং স্মার্ট বাজেট নিয়ন্ত্রণ করতে VIP প্রিমিয়াম মেম্বারশিপে আপগ্রেড করুন।
          </p>
          <button
            onClick={onOpenPremium}
            className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            আনলক করুন (মাত্র ₹৯৯)
          </button>
        </div>
      )}
    </div>
  );
}
