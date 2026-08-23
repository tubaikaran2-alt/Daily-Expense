import React, { useState } from 'react';
import { setIsPremium } from '../utils/premium';
import {
  X,
  Crown,
  Check,
  Sparkles,
  ShieldAlert,
  CreditCard,
  QrCode,
  Loader2,
  Lock,
  Smartphone,
  ArrowLeft
} from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId?: string;
}

export function PremiumModal({ isOpen, onClose, onSuccess, userId }: PremiumModalProps) {
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'success'>('details');
  const [selectedPlan, setSelectedPlan] = useState<'1year' | '5years'>('1year');
  const [selectedMethod, setSelectedMethod] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInput, setPaymentInput] = useState('');
  const [paymentPin, setPaymentPin] = useState('');

  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (!userId) {
      alert('ইউজার সেশন পাওয়া যায়নি। অনুগ্রহ করে লগইন করুন। (User session not found. Please log in first.)');
      return;
    }
    setCheckoutStep('payment');
  };

  const handleFinalPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (selectedMethod !== 'qr' && !paymentInput.trim()) {
      alert('অনুগ্রহ করে আপনার ১০-ডিজিট মোবাইল নম্বর অথবা ইউপিআই আইডি প্রদান করুন। (Please enter your 10-digit Mobile number or UPI ID.)');
      return;
    }

    setIsProcessing(true);

    // Simulate safe payment gateway processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsPremium(userId, true);
      setCheckoutStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset states
        setCheckoutStep('details');
        setPaymentInput('');
        setPaymentPin('');
      }, 3000);
    }, 2000);
  };

  const getPrice = () => {
    return selectedPlan === '1year' ? 99 : 400;
  };

  const getPlanNameBn = () => {
    return selectedPlan === '1year' ? '১ বছরের প্রো সাবস্ক্রিপশন (1 Year)' : '৫ বছরের প্রো সাবস্ক্রিপশন (5 Years)';
  };

  const getPlanNameEn = () => {
    return selectedPlan === '1year' ? '1 Year Pro' : '5 Years Pro';
  };

  const premiumFeatures = [
    { title: 'Google Sheet আনলিমিটেড সিঙ্ক', desc: 'কোনো লিমিট ছাড়া আপনার সমস্ত এন্ট্রি লাইভ ক্লাউডে সিঙ্ক করুন।' },
    { title: '৭ দিন ও ৩০ দিনের সাপ্তাহিক গতিধারা চার্ট', desc: 'খরচ এবং জমার গ্রাফিকাল ভিজ্যুয়ালাইজেশন আনলক করুন।' },
    { title: 'প্রফেশনাল পিডিএফ ও এক্সেল (CSV) এক্সপোর্ট', desc: 'সহজে প্রিন্ট করার মত চমৎকার পিডিএফ এবং এক্সেল ডাটা রিপোর্ট।' },
    { title: '১০০% বিজ্ঞাপন মুক্ত স্ক্রীন (Ads Free)', desc: 'বিরক্তিকর এডস ব্যানার রিমুভ করে সম্পূর্ণ ক্লিন এক্সপেরিয়েন্স।' },
    { title: 'সুরক্ষিত পিন এবং ফিঙ্গারপ্রিন্ট অটো-লক', desc: 'নিরাপত্তা বৃদ্ধি করতে ফিঙ্গারপ্রিন্ট বায়োমেট্রিক সিকিউরিটি স্ক্রিন।' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {checkoutStep === 'details' && (
          <div className="p-6 space-y-5">
            {/* Header branding */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10 animate-bounce">
                <Crown className="w-8 h-8 fill-amber-400/25" />
              </div>
              <h3 className="text-xl font-black text-slate-100 flex items-center justify-center gap-1.5">
                Go VIP Premium
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">
                বিজ্ঞাপনমুক্ত এবং আনলিমিটেড সিঙ্ক সুবিধা উপভোগ করুন
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
              {premiumFeatures.map((feat, index) => (
                <div key={index} className="flex gap-2.5 items-start">
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{feat.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Selector Grid */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">প্ল্যান সিলেক্ট করুন (Select Plan)</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('1year')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    selectedPlan === '1year'
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-md'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-indigo-600 text-[8px] font-black uppercase text-white px-2 py-0.5 rounded-bl">
                    SAVE
                  </div>
                  <h4 className="text-xs font-black text-slate-100">1 Year Plan</h4>
                  <p className="text-[10px] text-slate-500 mt-1">রেগুলার প্রো ফিচার্স</p>
                  <div className="text-base font-black text-indigo-400 mt-2">
                    ₹৯৯ <span className="text-[10px] text-slate-500 font-bold">/ year</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan('5years')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    selectedPlan === '5years'
                      ? 'bg-amber-500/10 border-amber-500 shadow-md'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-amber-500 text-[8px] font-black uppercase text-slate-950 px-2 py-0.5 rounded-bl">
                    BEST VALUE
                  </div>
                  <h4 className="text-xs font-black text-slate-100">5 Years Plan</h4>
                  <p className="text-[10px] text-slate-500 mt-1">লং-টার্ম পকেট বাজেট</p>
                  <div className="text-base font-black text-amber-400 mt-2">
                    ₹৪০০ <span className="text-[10px] text-slate-500 font-bold">/ 5 years</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleUpgrade}
                className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:brightness-110 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/10 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>কনটিনিউ করুন (₹{getPrice()})</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ড্যাশবোর্ডে ফিরে যান (Back to Dashboard)</span>
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'payment' && (
          <form onSubmit={handleFinalPayment} className="p-6 space-y-4">
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('details')}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-all mb-2"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>প্ল্যান পরিবর্তনে ফিরে যান (Back to Plans)</span>
              </button>
              <h4 className="text-sm font-black text-slate-100 mb-0.5">নিরাপদ পেমেন্ট গেটওয়ে (UPI Gateway)</h4>
              <p className="text-[10px] text-slate-400">
                নির্বাচিত প্ল্যান: <strong className="text-amber-400">₹{getPrice()} - {getPlanNameEn()}</strong>
              </p>
            </div>

            {/* Indian UPI payment methods */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('gpay');
                  setPaymentInput('');
                }}
                className={`py-2 rounded-xl text-[10px] font-black border transition-all text-center ${
                  selectedMethod === 'gpay'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                    : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}
              >
                GPay
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('phonepe');
                  setPaymentInput('');
                }}
                className={`py-2 rounded-xl text-[10px] font-black border transition-all text-center ${
                  selectedMethod === 'phonepe'
                    ? 'bg-purple-600/10 border-purple-500 text-purple-400'
                    : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}
              >
                PhonePe
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('paytm');
                  setPaymentInput('');
                }}
                className={`py-2 rounded-xl text-[10px] font-black border transition-all text-center ${
                  selectedMethod === 'paytm'
                    ? 'bg-cyan-600/10 border-cyan-500 text-cyan-400'
                    : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}
              >
                Paytm
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('qr');
                  setPaymentInput('');
                }}
                className={`py-2 rounded-xl text-[10px] font-black border transition-all text-center flex items-center justify-center gap-1 ${
                  selectedMethod === 'qr'
                    ? 'bg-amber-600/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}
              >
                <QrCode className="w-3 h-3" />
                <span>UPI QR</span>
              </button>
            </div>

            {/* Input fields based on selection */}
            {selectedMethod !== 'qr' ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    ১০-ডিজিট মোবাইল অথবা ইউপিআই আইডি (10-Digit Mobile / UPI ID)
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={paymentInput}
                      onChange={(e) => setPaymentInput(e.target.value)}
                      placeholder="e.g., 9876543210 or username@upi"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    সিক্রেট ইউপিআই পিন (UPI PIN)
                  </label>
                  <input
                    type="password"
                    required
                    value={paymentPin}
                    onChange={(e) => setPaymentPin(e.target.value)}
                    placeholder="••••"
                    maxLength={6}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-mono text-slate-200 tracking-widest outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                  {/* Generated clean geometric style simulated QR code */}
                  <div className="w-full h-full border-2 border-slate-900 border-dashed relative flex items-center justify-center text-slate-900">
                    <QrCode className="w-16 h-16 stroke-[1.5]" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-300">Scan UPI QR Code to Pay</p>
                  <p className="text-[9px] text-indigo-400 mt-0.5">UPI ID: <span className="font-mono text-[10px] font-bold text-white">pay-dailyexpense@upi</span></p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>পেমেন্ট ভেরিফাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 fill-slate-950" />
                    <span>পেমেন্ট নিশ্চিত করুন (₹{getPrice()})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>ড্যাশবোর্ডে ফিরে যান (Back to Dashboard)</span>
              </button>
            </div>
          </form>
        )}

        {checkoutStep === 'success' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-9 h-9 stroke-[2.5] animate-scale-up" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100">পেমেন্ট সফল হয়েছে! 🎉</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal max-w-[280px] mx-auto">
                অভিনন্দন! আপনার অ্যাকাউন্টটি সফলভাবে <strong className="text-amber-400">{getPlanNameEn()} মেম্বারশিপে</strong> আপগ্রেড করা হয়েছে।
              </p>
            </div>
            <p className="text-[10px] text-slate-500 animate-pulse">
              সিস্টেম রিলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
