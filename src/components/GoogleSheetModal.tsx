import React, { useState } from 'react';
import { SheetConfig } from '../types';
import {
  X,
  FileSpreadsheet,
  Cloud,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfig;
  onSaveConfig: (cfg: SheetConfig) => void;
  onSyncAll: () => Promise<void>;
  isSyncing: boolean;
  totalTransactionsCount: number;
  unsyncedCount: number;
}

export function GoogleSheetModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onSyncAll,
  isSyncing,
  totalTransactionsCount,
  unsyncedCount,
}: GoogleSheetModalProps) {
  const [webAppUrl, setWebAppUrl] = useState(config.webAppUrl);
  const [sheetUrl, setSheetUrl] = useState(config.sheetUrl);
  const [autoSync, setAutoSync] = useState(config.autoSync);
  const [isCopied, setIsCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      webAppUrl: webAppUrl.trim(),
      sheetUrl: sheetUrl.trim(),
      autoSync
    });
    alert('Google Sheet কনফিগারেশন সফলভাবে সেভ করা হয়েছে! ✨');
  };

  // Google Apps Script source code to provide the user
  const appsScriptCode = `/*
  Google Sheet Connector Script for Daily Expense
  Instructions:
  1. Open a Google Sheet. Create three tabs named: "Main", "User", and "Review".
  2. In Google Sheets, go to Extensions -> Apps Script.
  3. Delete any default code and paste this script.
  4. Click "Deploy" (top right) -> "New Deployment".
  5. Select type: "Web app".
  6. Execute as: "Me" (your email).
  7. Who has access: "Anyone".
  8. Click Deploy, authorize permissions, and copy the "Web App URL" into HisabKhata!
*/

function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    var data = {};
    try {
      data = JSON.parse(jsonString);
    } catch (parseError) {
      // fallback if payload is parsed as key-value parameters
    }
    
    // Support dual parameters for ultimate safety: query param (?sheetName=User) OR JSON body ({ "sheetName": "User" })
    var sheetName = (e.parameter && e.parameter.sheetName) || data.sheetName;
    
    // Auto-detect fallback based on payload attributes if sheetName is missing
    if (!sheetName) {
      if (data.email !== undefined && data.pin !== undefined) {
        sheetName = "User";
      } else if (data.rating !== undefined || data.comment !== undefined) {
        sheetName = "Review";
      } else {
        sheetName = "Main";
      }
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    
    // Check aliases for Main / Transactions tab
    if (!sheet && (sheetName === "Main" || sheetName === "Transactions")) {
      sheet = ss.getSheetByName("Transactions") || ss.getSheetByName("Main");
    }
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Initialize or check headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      if (sheetName === "User") {
        sheet.appendRow(["Timestamp", "Email", "Name", "Password/PIN"]);
      } else if (sheetName === "Main" || sheetName === "Transactions") {
        sheet.appendRow(["Timestamp", "User ID/Email", "Type", "Category", "Amount", "Notes"]);
      } else if (sheetName === "Review") {
        sheet.appendRow(["Timestamp", "User ID/Email", "Rating", "Comment"]);
      }
    }
    
    // Append rows based on sheet targeting
    if (sheetName === "Main" || sheetName === "Transactions") {
      // Columns strictly matching: Timestamp, User ID/Email, Type, Category, Amount, Notes
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.userId || "",
        data.type || "",
        data.category || "",
        Number(data.amount || 0),
        data.note || data.notes || data.remarks || ""
      ]);
    } else if (sheetName === "User") {
      // Columns strictly matching: Timestamp, Email, Name, Password/PIN
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.email || "",
        data.name || "",
        data.pin || ""
      ]);
    } else if (sheetName === "Review") {
      // Columns strictly matching: Timestamp, User ID/Email, Rating, Comment
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.userId || "",
        Number(data.rating || 5),
        data.comment || ""
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/25">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100">Google Sheet লাইভ সিঙ্ক</h3>
              <p className="text-[10px] text-slate-400">আপনার সমস্ত ডেটা সরাসরি ক্লাউড শিটে রাখুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Connection Status Indicator */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                স্টোরেজ স্ট্যাটাস (Storage Sync)
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${config.webAppUrl ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-xs font-bold text-slate-200">
                  {config.webAppUrl ? 'সংযুক্ত রয়েছে ✨' : 'সংযুক্ত নেই'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                মোট: {totalTransactionsCount}টি লেনদেন | অসিঙ্কড: {unsyncedCount}টি
              </p>
            </div>

            <button
              onClick={onSyncAll}
              disabled={isSyncing || !config.webAppUrl}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0 active:scale-95 flex items-center gap-1.5"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>সিঙ্ক হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5" />
                  <span>সিঙ্ক করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Form setup */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Google Script Web App URL
              </label>
              <input
                type="url"
                required
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs font-mono text-slate-200 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Google Sheet URL (অপশনাল ভিউ লিংক)
              </label>
              <input
                type="url"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs font-mono text-slate-200 outline-none transition-all"
              />
            </div>

            {/* Auto sync option */}
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200">অটোমেটিক ক্লাউড সিঙ্ক</span>
                <p className="text-[10px] text-slate-500">লেনদেন যুক্ত করার সাথে সাথে শিটে সেভ হবে</p>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-800"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98]"
              >
                লিংক সেভ করুন 💾
              </button>
              
              {config.sheetUrl && (
                <a
                  href={config.sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700/50 transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>শীট ওপেন</span>
                </a>
              )}
            </div>
          </form>

          {/* Interactive Instructions accordion */}
          <div className="border-t border-slate-850 pt-4">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 transition-all py-1"
            >
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Info className="w-4 h-4" />
                শিট কিভাবে কানেক্ট করবেন? (Instructions)
              </span>
              {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showInstructions && (
              <div className="mt-3 space-y-4 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 animate-fade-in">
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    একটি নতুন <strong className="text-white">Google Sheet</strong> তৈরি করুন।
                  </li>
                  <li>
                    শিটের নিচে ৩টি আলাদা ট্যাব/শীট তৈরি করুন এবং রিনেম করুন:
                    <div className="flex gap-1.5 mt-1">
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px] font-bold text-emerald-400">Main</span>
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px] font-bold text-indigo-400">User</span>
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px] font-bold text-violet-400">Review</span>
                    </div>
                  </li>
                  <li>
                    উপরের মেনুবার থেকে <strong className="text-white">Extensions -&gt; Apps Script</strong> এ যান।
                  </li>
                  <li>
                    পূর্বের কোড মুছে দিয়ে নিচের কোডটি কপি করে সম্পূর্ণ পেস্ট করুন:
                  </li>
                </ol>

                {/* Code Copy Area */}
                <div className="relative mt-2 rounded-xl bg-slate-950 border border-slate-800 p-3 max-h-[160px] overflow-y-auto">
                  <pre className="text-[10px] font-mono text-slate-400 leading-normal select-all">
                    {appsScriptCode}
                  </pre>
                  <button
                    onClick={copyScriptToClipboard}
                    className="absolute top-2 right-2 p-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-all flex items-center gap-1"
                  >
                    {isCopied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'কপিড!' : 'কপি করুন'}</span>
                  </button>
                </div>

                <ol start={5} className="list-decimal list-inside space-y-2 mt-3">
                  <li>
                    উপরের <strong className="text-white">Deploy -&gt; New Deployment</strong> এ ক্লিক করুন।
                  </li>
                  <li>
                    টাইপ সিলেক্ট করুন <strong className="text-white">Web app</strong>।
                  </li>
                  <li>
                    Execute as: <strong className="text-white">Me (আপনার জিমেইল)</strong> এবং Who has access: <strong className="text-white">Anyone</strong> দিয়ে Deploy চাপুন।
                  </li>
                  <li>
                    অনুমতি চাইলে পাস করুন এবং ডিপ্লয়মেন্ট সম্পন্ন হলে <strong className="text-emerald-400 font-bold">Web App URL</strong> টি কপি করে উপরে পেস্ট করুন।
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
