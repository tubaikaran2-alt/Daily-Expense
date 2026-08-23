import React, { useRef, useState } from 'react';
import { Transaction } from '../types';
import {
  X,
  FileJson,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  DownloadCloud,
  Crown,
  Lock,
  RefreshCw,
  Sparkles,
  Printer
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onImportTransactions: (imported: Transaction[]) => void;
  onResetToDemo: () => void;
  isPremium: boolean;
  onOpenPremium: () => void;
  userName?: string;
  userEmail?: string;
}

export function ExportModal({
  isOpen,
  onClose,
  transactions,
  onImportTransactions,
  onResetToDemo,
  isPremium,
  onOpenPremium,
  userName = 'Daily Expense User',
  userEmail = 'user@gmail.com',
}: ExportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export to Backup JSON
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `daily_expense_backup_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      alert('ব্যকআপ ফাইল তৈরিতে সমস্যা হয়েছে।');
    }
  };

  // 2. Import from Backup JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed: Transaction[] = JSON.parse(result);

        if (Array.isArray(parsed)) {
          // Soft validation
          const isValid = parsed.every((tx) => tx.id && tx.amount !== undefined && tx.category);
          if (isValid) {
            onImportTransactions(parsed);
            setImportStatus('✅ ব্যাকআপ ফাইলটি সফলভাবে রিস্টোর হয়েছে!');
            setTimeout(() => setImportStatus(null), 4000);
          } else {
            setImportStatus('❌ ফাইলের ফরম্যাটটি সঠিক নয়!');
          }
        } else {
          setImportStatus('❌ ফাইলের ভেতরের তথ্য সঠিক নয়!');
        }
      } catch (err) {
        setImportStatus('❌ ফাইলটি রিড করতে ব্যর্থ হয়েছে!');
      }
    };
    reader.readAsText(file);
  };

  // 3. Export to CSV (Excel format - Premium Feature)
  const handleExportCSV = () => {
    if (!isPremium) {
      onOpenPremium();
      return;
    }

    try {
      const headers = ['ID', 'Type', 'Category', 'Amount (INR)', 'Note', 'Date', 'Time'];
      const rows = transactions.map((tx) => [
        tx.id,
        tx.type,
        tx.category,
        tx.amount,
        tx.note || '',
        tx.date,
        tx.time
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `daily_expense_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('CSV রিপোর্ট তৈরিতে ত্রুটি দেখা দিয়েছে।');
    }
  };

  // 4. Generate & Print PDF Report (Premium Feature)
  const handlePrintPDF = () => {
    if (!isPremium) {
      onOpenPremium();
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('পপআপ উইন্ডো ব্লক করা রয়েছে। অনুগ্রহ করে অনুমতি দিন।');
      return;
    }

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);
    const balance = totalIncome - totalExpense;

    const tableRows = transactions
      .map(
        (tx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-size: 12px; color: #1e293b;">${tx.date} ${tx.time}</td>
        <td style="padding: 10px; font-size: 12px; font-weight: bold; color: #1e293b;">${tx.category}</td>
        <td style="padding: 10px; font-size: 11px; color: #475569;">${tx.note || '-'}</td>
        <td style="padding: 10px; font-size: 12px; font-weight: bold; text-align: right; color: ${
          tx.type === 'income' ? '#10b981' : '#f43f5e'
        }">
          ${tx.type === 'income' ? '+' : '-'}₹${tx.amount.toLocaleString('en-IN')}
        </td>
      </tr>
    `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Daily Expense - আর্থিক বিবরণী</title>
          <style>
            body { font-family: 'Helvetica Neue', 'Arial', sans-serif; padding: 40px; color: #334155; }
            .header { display: flex; justify-content: space-between; border-b: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .meta { font-size: 12px; text-align: right; line-height: 1.5; }
            .summary-cards { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; }
            .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 5px; }
            .card-value { font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f1f5f9; padding: 12px; font-size: 11px; text-align: left; text-transform: uppercase; color: #475569; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Daily Expense</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">স্মার্ট ও নিরাপদ দৈনিক খরচ ট্র্যাকিং</div>
            </div>
            <div class="meta">
              <strong>ইউজার:</strong> ${userName}<br/>
              <strong>ইমেইল:</strong> ${userEmail}<br/>
              <strong>রিপোর্ট তৈরির তারিখ:</strong> ${new Date().toLocaleDateString('en-IN')}
            </div>
          </div>

          <div class="summary-cards">
            <div class="card">
              <div class="card-title">মোট জমা (Income)</div>
              <div class="card-value" style="color: #10b981;">₹${totalIncome.toLocaleString('en-IN')}</div>
            </div>
            <div class="card">
              <div class="card-title">মোট খরচ (Expense)</div>
              <div class="card-value" style="color: #f43f5e;">₹${totalExpense.toLocaleString('en-IN')}</div>
            </div>
            <div class="card">
              <div class="card-title">মোট উদ্বৃত্ত (Net Balance)</div>
              <div class="card-value" style="color: #4f46e5;">₹${balance.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <h3 style="font-size: 14px; color: #1e293b; margin-bottom: 12px;">লেনদেন সমূহের রেকর্ড তালিকা</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">তারিখ ও সময়</th>
                <th style="width: 30%;">ক্যাটাগরি</th>
                <th style="width: 25%;">বিবরণ</th>
                <th style="width: 20%; text-align: right;">পরিমাণ</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            এটি একটি Daily Expense ডিজিটাল সিস্টেম জেনারেটেড রিপোর্ট। সর্বস্বত্ব সংরক্ষিত।
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800/80 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/25">
              <Printer className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100">রিপোর্ট ও ব্যাকআপ সিস্টেম</h3>
              <p className="text-[10px] text-slate-400">অফলাইন রিকভারি এবং এক্সপোর্ট টুলস</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {importStatus && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs text-center font-bold text-slate-200">
              {importStatus}
            </div>
          )}

          {/* SECTION 1: FREE OFFLINE BACKUP (JSON) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">
              ফ্রি অফলাইন ব্যাকআপ (JSON Format)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJSON}
                className="py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <DownloadCloud className="w-4 h-4 text-slate-400" />
                <span>ডাউনলোড ব্যাকআপ</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4 text-slate-400" />
                <span>রিস্টোর ব্যাকআপ</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
            <p className="text-[9px] text-slate-500 text-center leading-normal">
              আপনার সমস্ত লেনদেনের হিসেব একটি নিরাপদ অফলাইন ফাইলে ডাউনলোড করে রাখতে পারেন এবং পরবর্তীতে রিস্টোর করতে পারেন।
            </p>
          </div>

          {/* SECTION 2: PREMIUM REPORTS (EXCEL/PDF) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block flex items-center gap-1">
                প্রিমিয়াম এক্সপোর্ট ও রিপোর্ট
                {!isPremium && <Crown className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400 animate-pulse" />}
              </span>
              {!isPremium && (
                <span className="text-[8px] font-bold uppercase text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800/50">
                  VIP ONLY
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* CSV Excel */}
              <button
                onClick={handleExportCSV}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 border ${
                  isPremium
                    ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
                    : 'bg-slate-900/40 border-slate-900/60 text-slate-500'
                }`}
              >
                <FileSpreadsheet className={`w-5 h-5 ${isPremium ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>Excel (CSV) ফাইল</span>
              </button>

              {/* PDF report */}
              <button
                onClick={handlePrintPDF}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 border ${
                  isPremium
                    ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
                    : 'bg-slate-900/40 border-slate-900/60 text-slate-500'
                }`}
              >
                <FileText className={`w-5 h-5 ${isPremium ? 'text-red-400' : 'text-slate-600'}`} />
                <span>PDF রিপোর্ট প্রিন্ট</span>
              </button>
            </div>

            {!isPremium && (
              <div className="pt-2 text-center">
                <button
                  onClick={onOpenPremium}
                  className="inline-flex items-center gap-1 text-[10px] text-amber-300 hover:text-amber-200 font-bold underline"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>VIP আপগ্রেড করে রিপোর্ট আনলক করুন</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: SYSTEM RESET */}
          <div className="flex items-center justify-between p-3 bg-rose-950/10 border border-rose-500/15 rounded-2xl">
            <div>
              <span className="text-[10px] font-bold text-rose-400 block">সিস্টেম ডেমো ডাটা রিসেট</span>
              <p className="text-[9px] text-slate-500 leading-normal">সমস্ত প্র্যাকটিস তথ্য ডিফল্ট ডেমোতে রিলোড করুন</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('আপনি কি ডেমো ডাটাতে ফিরে যেতে চান? পূর্বের হিসেব মুছে যেতে পারে।')) {
                  onResetToDemo();
                }
              }}
              className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-400 rounded-lg text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>রিসেট ডেমো</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
