import { Transaction } from '../types';

export interface CategoryItem {
  id: string;
  name: string;
  englishName: string;
  type: 'income' | 'expense';
  color: string;
  iconName: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  // Income Categories
  { id: 'inc-salary', name: 'বেতন (Salary)', englishName: 'Salary', type: 'income', color: 'emerald', iconName: 'Briefcase' },
  { id: 'inc-freelance', name: 'ফ্রিল্যান্সিং (Freelance)', englishName: 'Freelancing', type: 'income', color: 'teal', iconName: 'Laptop' },
  { id: 'inc-business', name: 'ব্যবসা (Business)', englishName: 'Business', type: 'income', color: 'cyan', iconName: 'TrendingUp' },
  { id: 'inc-investment', name: 'বিনিয়োগ (Investment)', englishName: 'Investment', type: 'income', color: 'sky', iconName: 'LineChart' },
  { id: 'inc-gift', name: 'উপহার (Gift)', englishName: 'Gift', type: 'income', color: 'violet', iconName: 'Gift' },
  { id: 'inc-other', name: 'অন্যান্য আয় (Other Income)', englishName: 'Other Income', type: 'income', color: 'indigo', iconName: 'PlusCircle' },

  // Expense Categories
  { id: 'exp-food', name: 'বাজার ও খাদ্য (Food & Grocery)', englishName: 'Food & Grocery', type: 'expense', color: 'rose', iconName: 'Utensils' },
  { id: 'exp-rent', name: 'বাড়ি ভাড়া ও বিল (Rent & Bills)', englishName: 'Rent & Bills', type: 'expense', color: 'amber', iconName: 'Home' },
  { id: 'exp-transport', name: 'যাতায়াত (Transport)', englishName: 'Transport', type: 'expense', color: 'blue', iconName: 'Car' },
  { id: 'exp-medical', name: 'চিকিৎসা ও ওষুধ (Medical & Health)', englishName: 'Medical', type: 'expense', color: 'red', iconName: 'Activity' },
  { id: 'exp-education', name: 'শিক্ষা ও বই (Education)', englishName: 'Education', type: 'expense', color: 'orange', iconName: 'BookOpen' },
  { id: 'exp-entertainment', name: 'বিনোদন ও ভ্রমণ (Travel)', englishName: 'Travel & Fun', type: 'expense', color: 'fuchsia', iconName: 'Compass' },
  { id: 'exp-shopping', name: 'কেনাকাটা (Shopping)', englishName: 'Shopping', type: 'expense', color: 'pink', iconName: 'ShoppingBag' },
  { id: 'exp-family', name: 'পরিবার ও সাহায্য (Family)', englishName: 'Family Support', type: 'expense', color: 'purple', iconName: 'Heart' },
  { id: 'exp-other', name: 'অন্যান্য খরচ (Other Expense)', englishName: 'Other Expense', type: 'expense', color: 'slate', iconName: 'HelpCircle' }
];

// Initial demo transactions for first load
const now = new Date();
const formatDate = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(now.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'demo-1',
    userId: 'usedeo2@gmail.com',
    type: 'income',
    amount: 45000,
    category: 'বেতন (Salary)',
    note: 'জুলাই মাসের বেতন',
    date: formatDate(10),
    time: '10:00 AM',
    syncedToSheet: false
  },
  {
    id: 'demo-2',
    userId: 'usedeo2@gmail.com',
    type: 'income',
    amount: 12000,
    category: 'ফ্রিল্যান্সিং (Freelance)',
    note: 'মোবাইল ইউআই ডিজাইন প্রজেক্ট',
    date: formatDate(5),
    time: '04:30 PM',
    syncedToSheet: false
  },
  {
    id: 'demo-3',
    userId: 'usedeo2@gmail.com',
    type: 'expense',
    amount: 15000,
    category: 'বাড়ি ভাড়া ও বিল (Rent & Bills)',
    note: 'বাসা ভাড়া এবং বিদ্যুৎ বিল পরিশোধ',
    date: formatDate(8),
    time: '08:00 PM',
    syncedToSheet: false
  },
  {
    id: 'demo-4',
    userId: 'usedeo2@gmail.com',
    type: 'expense',
    amount: 3200,
    category: 'বাজার ও খাদ্য (Food & Grocery)',
    note: 'সাপ্তাহিক বাজার ও মাছ-সবজি কেনা',
    date: formatDate(4),
    time: '11:15 AM',
    syncedToSheet: false
  },
  {
    id: 'demo-5',
    userId: 'usedeo2@gmail.com',
    type: 'expense',
    amount: 1800,
    category: 'যাতায়াত (Transport)',
    note: 'উবার ও রিকশা ভাড়া',
    date: formatDate(3),
    time: '09:00 AM',
    syncedToSheet: false
  },
  {
    id: 'demo-6',
    userId: 'usedeo2@gmail.com',
    type: 'expense',
    amount: 2500,
    category: 'কেনাকাটা (Shopping)',
    note: 'নতুন পাঞ্জাবি কেনা হলো',
    date: formatDate(2),
    time: '07:45 PM',
    syncedToSheet: false
  },
  {
    id: 'demo-7',
    userId: 'usedeo2@gmail.com',
    type: 'expense',
    amount: 1200,
    category: 'চিকিৎসা ও ওষুধ (Medical & Health)',
    note: 'বাবার প্রেসারের ওষুধ ও ডাক্তারের ফিস',
    date: formatDate(1),
    time: '06:20 PM',
    syncedToSheet: false
  }
];
