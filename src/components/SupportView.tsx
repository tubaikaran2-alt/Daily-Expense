import React, { useState } from 'react';
import { UserFeedback } from '../types';
import { Star, MessageSquare, ShieldQuestion, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface SupportViewProps {
  webAppUrl: string;
  userId: string;
  userName: string;
  onFeedbackSubmitted: (fb: any) => Promise<void>;
}

export function SupportView({ webAppUrl, userId, userName, onFeedbackSubmitted }: SupportViewProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion items
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Daily Expense কানেকশন কিভাবে কাজ করে?',
      a: 'এই অ্যাপ্লিকেশনটি সম্পূর্ণ অফলাইন-ফার্স্ট প্রযুক্তিতে তৈরি। আপনার অনুমতি ছাড়া কোনো ডাটা অন্য কোথাও যায় না। আপনি চাইলে আপনার নিজস্ব Google Apps Script-এর মাধ্যমে আপনার অ্যাকাউন্টের ডাটা সরাসরি নিজের পার্সোনাল গুগল ড্রাইভে সিঙ্ক করে রাখতে পারেন।'
    },
    {
      q: 'পিন বা পাসওয়ার্ড ভুলে গেলে কি করবো?',
      a: 'নিরাপত্তার স্বার্থে আপনার সিক্রেট পিনটি আপনার ব্রাউজার স্টোরেজে সেভ থাকে। কোনো কারণে ভুলে গেলে, আপনি প্রোফাইল রিমুভ করে নতুন করে রেজিস্টার করতে পারেন, তবে রিকভারি করতে আপনার ডাউনলোড করা ব্যাকআপ (.json) ফাইলটি অত্যন্ত সাহায্য করবে।'
    },
    {
      q: 'প্রিমিয়াম মেম্বারশিপের পেমেন্ট কি রিফান্ড করা যায়?',
      a: 'আমরা গুগল পে (Google Pay), ফোনপে (PhonePe), পেটিএম (Paytm) এবং ইউপিআই কিউআর (UPI QR) কোডের মাধ্যমে পেমেন্ট নিয়ে থাকি। এটি একটি ডেমো গেটওয়ে হওয়ায় কোনো প্রকৃত অর্থ কাটে না, তবে রিয়েল সিস্টেমে যেকোনো সমস্যা সমাধানের জন্য কাস্টমার কেয়ারে যোগাযোগ করতে পারেন।'
    },
    {
      q: 'আমার ডাটা কি সম্পূর্ণ সুরক্ষিত ও গোপন থাকবে?',
      a: 'হ্যাঁ, সম্পূর্ণ সুরক্ষিত! Daily Expense কোনো থার্ড পার্টি ডাটাবেজ ব্যবহার করে না। আপনার সমস্ত তথ্য আপনার নিজের মোবাইল/ল্যাপটপ ব্রাউজার এবং আপনার নিজস্ব Google Sheets-এ সংরক্ষিত থাকে।'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('অনুগ্রহ করে আপনার মূল্যবান মতামতটি লিখুন।');
      return;
    }

    setIsSubmitting(true);
    await onFeedbackSubmitted({
      rating,
      stars: rating,
      comment: comment.trim(),
      review: comment.trim(),
      userId,
      name: userName || 'User',
      timestamp: new Date().toISOString()
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setComment('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. FAQ ACCORDION SECTION */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-slate-200 flex items-center gap-2">
          <ShieldQuestion className="w-5 h-5 text-indigo-400" />
          <span>সচরাচর জিজ্ঞাসা (FAQ & Guidelines)</span>
        </h3>

        <div className="space-y-2">
          {faqItems.map((item, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-850 bg-slate-950/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full text-left px-4 py-3 flex justify-between items-center text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  <span>{item.q}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 text-[11px] text-slate-400 leading-relaxed border-t border-slate-900/50 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. INTERACTIVE RATINGS & FEEDBACK FORM */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-black text-slate-200">ইউজার রিভিউ ও মতামত</h3>
            <p className="text-[10px] text-slate-500">আপনার মতামত আমাদের অ্যাপের মান উন্নত করতে সাহায্য করবে</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center space-y-2 py-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-xs font-bold text-slate-200">রিভিউ জমা দেওয়ার জন্য ধন্যবাদ! ⭐</h4>
            <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              আপনার দেওয়া রেটিং সরাসরি আমাদের গুগল শিটে সফলভাবে রেকর্ড করা হয়েছে।
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[10px] text-indigo-400 underline font-bold mt-2"
            >
              আরেকটি রিভিউ লিখুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Stars */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                আপনার রেটিং দিন (Give Rating)
              </label>
              
              <div className="flex gap-1.5 items-center pt-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isGold = (hoveredRating !== null ? star <= hoveredRating : star <= rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          isGold
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-slate-400 ml-2">
                  ({rating} স্টার রেটিং)
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                আপনার মূল্যবান মতামত (Your Feedback)
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="অ্যাপ্লিকেশনটি কেমন লেগেছে বা আপনার কি ধরনের ফিচার যুক্ত করা প্রয়োজন তা এখানে লিখুন..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-700 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>মতামত পাঠান (Send Feedback)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
