export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
  time: string;
  syncedToSheet: boolean;
}

export interface SheetConfig {
  webAppUrl: string;
  sheetUrl: string;
  userId: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface UserFeedback {
  rating: number;
  comment: string;
  userId: string;
  timestamp: string;
}

export interface AuthUser {
  email: string;
  name: string;
  pin: string;
  photoUrl?: string;
}

export interface BillReminder {
  id: string;
  userId: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  category: string;
  isPaid: boolean;
  recurring: 'monthly' | 'yearly' | 'one-time';
}
