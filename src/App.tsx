import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { TransactionForm } from './components/TransactionForm';
import { TrendChart } from './components/TrendChart';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { TransactionList } from './components/TransactionList';
import { Footer } from './components/Footer';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { ExportModal } from './components/ExportModal';
import { PremiumModal } from './components/PremiumModal';
import { AdBanner } from './components/AdBanner';
import { AuthScreen } from './components/AuthScreen';
import { PinSetupModal } from './components/PinSetupModal';
import { BiometricUnlockScreen } from './components/BiometricUnlockScreen';
import { BottomNav, NavTab } from './components/BottomNav';
import { ProfileView } from './components/ProfileView';
import { SupportView } from './components/SupportView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BudgetLimitCard } from './components/BudgetLimitCard';
import { VisualAnalyticsDashboard } from './components/VisualAnalyticsDashboard';
import { AnalyticsReportsView } from './components/AnalyticsReportsView';
import { BillReminderModal } from './components/BillReminderModal';
import { AdMobInterstitial } from './components/AdMobInterstitial';
import { admobService } from './services/admobService';
import { trackCentralLogin, trackCentralReview } from './services/centralTrackingService';
import { DEFAULT_CATEGORIES, INITIAL_TRANSACTIONS } from './data/categories';
import { Transaction, SheetConfig, TransactionType, UserFeedback, AuthUser } from './types';
import { getSavedBiometricConfig, setSavedBiometricConfig } from './utils/biometric';
import { getIsPremium, setIsPremium } from './utils/premium';
import {
  Cloud,
  FileSpreadsheet,
  Download,
  Crown,
  Sparkles,
  Lock,
  Zap,
  CheckCircle2,
  Layers,
  CalendarClock
} from 'lucide-react';

const STORAGE_KEY_TX = 'ft3d_transactions_v1';
const STORAGE_KEY_CONFIG = 'ft3d_sheet_config_v1';
const STORAGE_KEY_AUTH = 'ft3d_auth_user_v1';

export const DEFAULT_USER_ID = 'usedeo2@gmail.com';
export const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyYSjQXKb2r_j_gX545x0yEOXsK4n-i56MTldsIGvxHB2MAQi2DsZrC8o5k3DuN21Hh6g/exec';
export const DEFAULT_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/11Yb7pSFULMEOI8YBYPFVTWCtuMQkPYnXAulCSYTpml0/edit?usp=sharing';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  // Biometric configuration & lock state
  const [biometricConfig, setBiometricConfig] = useState(() => getSavedBiometricConfig());
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(false);
  const [pendingPinSetupUser, setPendingPinSetupUser] = useState<AuthUser | null>(null);
  const lastActivityTimestampRef = useRef<number>(Date.now());

  // Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch (e) {
      console.error('Failed to load auth user:', e);
    }
    return null;
  });

  // Premium Freemium Model State
  const [isPremium, setIsPremiumState] = useState<boolean>(() => {
    return getIsPremium(currentUser?.email);
  });
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAdMobInterstitialOpen, setIsAdMobInterstitialOpen] = useState(false);

  // Sync premium status with AdMob Service and initialize
  useEffect(() => {
    admobService.setPremiumStatus(isPremium);
    if (!isPremium) {
      admobService.initialize();
    }
  }, [isPremium]);

  // Initialize transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TX);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load transactions from storage:', e);
    }
    return INITIAL_TRANSACTIONS.map((tx) => ({
      ...tx,
      userId: DEFAULT_USER_ID
    }));
  });

  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          webAppUrl: parsed.webAppUrl && 
            !parsed.webAppUrl.includes('AKfycbw9SI3jBJ1aVehgyhLkbiPgRVxOxOfWHt4xXCtcFGxugxP1qBtVDvlBxuhodluOi1TsFw') &&
            !parsed.webAppUrl.includes('AKfycbwBdDhv4wRynGoSmy8jnuB7bzTTL4pXAkW2W8pMK3cOtQwoBz1P8MOr2NPd9iJ2TFkPfQ') &&
            !parsed.webAppUrl.includes('AKfycbx4LoW6WRQSrAlD6ix-olBM7DoKK_4KUyXOADMhE0zP1XA91HC_vrobtftFj3YqpF2g') &&
            !parsed.webAppUrl.includes('AKfycbP1TE7mshstG54ZNqqyJHTJ7VrkgPUL6B1fM--_HtqfaC6y_At79Cljg61sbPc5gUSbQ')
            ? parsed.webAppUrl
            : DEFAULT_WEB_APP_URL,
          sheetUrl: parsed.sheetUrl || DEFAULT_SPREADSHEET_URL,
          userId: parsed.userId || DEFAULT_USER_ID,
          autoSync: parsed.autoSync ?? true
        };
      }
    } catch (e) {
      console.error('Failed to load sheet config from storage:', e);
    }
    return {
      webAppUrl: DEFAULT_WEB_APP_URL,
      sheetUrl: DEFAULT_SPREADSHEET_URL,
      userId: DEFAULT_USER_ID,
      autoSync: true
    };
  });

  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBillReminderOpen, setIsBillReminderOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const activeUserId = currentUser ? currentUser.email : sheetConfig.userId || DEFAULT_USER_ID;

  // Monthly Budget Limit State
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(`ft3d_monthly_limit_${activeUserId}`);
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`ft3d_monthly_limit_${activeUserId}`);
      setMonthlyLimit(saved ? Number(saved) : null);
    } catch {
      setMonthlyLimit(null);
    }
  }, [activeUserId]);

  const handleUpdateLimit = (limit: number | null) => {
    setMonthlyLimit(limit);
    try {
      if (limit === null) {
        localStorage.removeItem(`ft3d_monthly_limit_${activeUserId}`);
        setSyncToast('বাজেট লিমিট মুছে ফেলা হয়েছে! 📊');
      } else {
        localStorage.setItem(`ft3d_monthly_limit_${activeUserId}`, String(limit));
        setSyncToast('বাজেট লিমিট সফলভাবে সেট করা হয়েছে! 🎯');
      }
      setTimeout(() => setSyncToast(null), 3000);
    } catch (e) {
      console.error('Failed to save budget limit:', e);
    }
  };

  // Listen to premium updates across the app
  useEffect(() => {
    setIsPremiumState(getIsPremium(currentUser?.email));

    const handlePremiumUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ userId: string; isPremium: boolean }>;
      const targetUser = customEvent.detail?.userId?.toLowerCase();
      const currentEmail = (currentUser?.email || '').toLowerCase();
      if (!targetUser || targetUser === currentEmail || targetUser === 'global') {
        setIsPremiumState(customEvent.detail.isPremium);
      }
    };

    window.addEventListener('daily_expense_premium_updated', handlePremiumUpdate);
    window.addEventListener('storage', () => {
      setIsPremiumState(getIsPremium(currentUser?.email));
    });

    return () => {
      window.removeEventListener('daily_expense_premium_updated', handlePremiumUpdate);
    };
  }, [currentUser]);

  // Persist auth user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
        setSheetConfig((prev) => ({ ...prev, userId: currentUser.email }));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  }, [currentUser]);

  // Persist transactions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions:', e);
    }
  }, [transactions]);

  // Persist config
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(sheetConfig));
    } catch (e) {
      console.error('Failed to save sheet config:', e);
    }
  }, [sheetConfig]);

  // Biometric Auto-Lock: Triggered ONLY after 3 continuous minutes of zero user activity (Idle Inactivity)
  useEffect(() => {
    if (!currentUser) return;

    let inactivityTimer: NodeJS.Timeout;
    const IDLE_INACTIVITY_LIMIT_MS = 3 * 60 * 1000;

    const handleUserInteraction = () => {
      lastActivityTimestampRef.current = Date.now();
      clearTimeout(inactivityTimer);

      if (!isBiometricLocked) {
        inactivityTimer = setTimeout(() => {
          setIsBiometricLocked(true);
        }, IDLE_INACTIVITY_LIMIT_MS);
      }
    };

    const activityEvents = [
      'mousedown',
      'mousemove',
      'pointerdown',
      'keydown',
      'keypress',
      'keyup',
      'touchstart',
      'touchmove',
      'touchend',
      'scroll',
      'wheel',
      'click',
      'input'
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    handleUserInteraction();

    const handleAppResumeCheck = () => {
      if (!isBiometricLocked && currentUser) {
        const timeSinceLastActivity = Date.now() - lastActivityTimestampRef.current;
        if (timeSinceLastActivity >= IDLE_INACTIVITY_LIMIT_MS) {
          setIsBiometricLocked(true);
        }
      }
    };

    window.addEventListener('focus', handleAppResumeCheck);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleAppResumeCheck();
      }
    });

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      window.removeEventListener('focus', handleAppResumeCheck);
    };
  }, [currentUser, isBiometricLocked]);

  // Filter transactions strictly by active user
  const userTransactions = transactions.filter(
    (t) => (t.userId || '').toLowerCase() === activeUserId.toLowerCase()
  );

  // User-Specific Balance & Calculations
  const totalIncome = userTransactions
    .filter((t) => t.type === 'income')
    .reduce((a, b) => a + Number(b.amount), 0);

  const totalExpense = userTransactions
    .filter((t) => t.type === 'expense')
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = totalIncome - totalExpense;
  const unsyncedTransactions = userTransactions.filter((t) => !t.syncedToSheet);

  // Monthly Carry-Forward Calculation
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthTransactions = userTransactions.filter((t) => {
    const txMonth = (t.date || '').substring(0, 7);
    return txMonth === currentMonthKey;
  });

  const currentMonthExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((a, b) => a + Number(b.amount), 0);
  
  const priorMonthTransactions = userTransactions.filter((t) => {
    const txMonth = (t.date || '').substring(0, 7);
    return txMonth && txMonth < currentMonthKey;
  });

  const priorIncome = priorMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((a, b) => a + Number(b.amount), 0);

  const priorExpense = priorMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((a, b) => a + Number(b.amount), 0);

  const priorClosingBalance = priorIncome - priorExpense;

  const hasCurrentMonthOpeningBalance = userTransactions.some((t) => {
    const isThisMonth = (t.date || '').substring(0, 7) === currentMonthKey;
    const isOpeningCategory = t.category.includes('প্রারম্ভিক') || t.category.toLowerCase().includes('opening');
    return isThisMonth && isOpeningCategory;
  });

  const pendingCarryover = (!hasCurrentMonthOpeningBalance && priorClosingBalance > 0)
    ? priorClosingBalance
    : undefined;

  // Helper to push arbitrary payloads to Google Sheet with dynamic sheet targeting
  const pushDataToGoogleSheet = async (sheetName: 'User' | 'Main' | 'Review', data: any, url: string): Promise<boolean> => {
    if (!url || !url.trim()) return false;
    try {
      const cleanUrl = url.trim();
      const separator = cleanUrl.includes('?') ? '&' : '?';
      const finalUrl = `${cleanUrl}${separator}sheetName=${encodeURIComponent(sheetName)}`;
      
      await fetch(finalUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetName,
          ...data
        })
      });
      return true;
    } catch (err) {
      console.warn(`Google Sheet sync error on tab ${sheetName}:`, err);
      return false;
    }
  };

  // Helper to push single transaction to Google Sheet
  const pushToGoogleSheet = async (tx: Transaction, url: string, targetUserId: string): Promise<boolean> => {
    return pushDataToGoogleSheet('Main', {
      sheetName: 'Main',
      timestamp: new Date().toISOString(),
      userId: targetUserId || activeUserId,
      type: tx.type,
      category: tx.category,
      amount: Number(tx.amount),
      note: tx.note || '',
      notes: tx.note || '',       // Explicitly include notes
      remarks: tx.note || '',     // Explicitly include remarks
      id: tx.id
    }, url);
  };

  // Handle online/offline events with automatic background sync when reconnected
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setSyncToast('🟢 ইন্টারনেট সংযোগ পাওয়া গেছে! ডেটা সিঙ্ক হচ্ছে...');

      // Auto-sync offline transactions to personal Google Sheet
      try {
        const savedTxJSON = localStorage.getItem(STORAGE_KEY_TX);
        const currentTxList: Transaction[] = savedTxJSON ? JSON.parse(savedTxJSON) : transactions;
        const unsynced = currentTxList.filter(
          (t) => (t.userId || '').toLowerCase() === activeUserId.toLowerCase() && !t.syncedToSheet
        );

        if (unsynced.length > 0 && sheetConfig.webAppUrl) {
          setIsSyncing(true);
          let successCount = 0;
          const updatedList = [...currentTxList];

          for (let i = 0; i < updatedList.length; i++) {
            const tx = updatedList[i];
            const isThisUser = (tx.userId || '').toLowerCase() === activeUserId.toLowerCase();
            if (isThisUser && !tx.syncedToSheet) {
              const ok = await pushToGoogleSheet(tx, sheetConfig.webAppUrl, activeUserId);
              if (ok) {
                updatedList[i] = { ...tx, syncedToSheet: true };
                successCount++;
              }
            }
          }

          if (successCount > 0) {
            setTransactions(updatedList);
            setSheetConfig((prev) => ({ ...prev, lastSyncedAt: new Date().toLocaleTimeString() }));
            setSyncToast(`সংযোগ সচল: ${successCount} টি অফলাইন এন্ট্রি গুগল শিটে সিঙ্ক হয়েছে! ☁️`);
          } else {
            setSyncToast('🟢 ইন্টারনেট সংযোগ সচল রয়েছে');
          }
          setIsSyncing(false);
        } else {
          setTimeout(() => setSyncToast(null), 3000);
        }
      } catch (err) {
        console.error('Auto-sync on reconnection failed:', err);
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncToast('📡 আপনি অফলাইনে আছেন। সমস্ত এন্ট্রি ডিভাইসে সেভ থাকবে।');
      setTimeout(() => setSyncToast(null), 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeUserId, sheetConfig.webAppUrl, transactions]);

  // Add new transaction
  const handleAddTransaction = async (data: {
    type: TransactionType;
    amount: number;
    category: string;
    note: string;
    date: string;
  }) => {
    const newTx: Transaction = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: activeUserId,
      type: data.type,
      amount: Number(data.amount),
      category: data.category,
      note: data.note,
      date: data.date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      syncedToSheet: false
    };

    let synced = false;
    if (isOnline && navigator.onLine && sheetConfig.webAppUrl && sheetConfig.autoSync) {
      setIsSyncing(true);
      synced = await pushToGoogleSheet(newTx, sheetConfig.webAppUrl, activeUserId);
      setIsSyncing(false);
      if (synced) {
        newTx.syncedToSheet = true;
        setSyncToast('এন্ট্রি Google Sheet-এ সংরক্ষিত হয়েছে! ✨');
        setTimeout(() => setSyncToast(null), 3000);
      } else {
        setSyncToast('অফলাইন মোড: এন্ট্রি ডিভাইসে সেভ হয়েছে (নেট পেলে সিঙ্ক হবে) 💾');
        setTimeout(() => setSyncToast(null), 3500);
      }
    } else {
      setSyncToast('অফলাইন মোড: এন্ট্রি লোকাল মেমোরিতে সেভ হয়েছে 💾');
      setTimeout(() => setSyncToast(null), 3500);
    }

    setTransactions((prev) => [newTx, ...prev]);

    // Check if adding this transaction will exceed the monthly budget limit
    if (monthlyLimit && monthlyLimit > 0 && data.type === 'expense') {
      const prospectiveTotal = currentMonthExpense + Number(data.amount);
      if (prospectiveTotal > monthlyLimit) {
        setSyncToast(`⚠️ সতর্কতা: আপনার চলতি মাসের খরচের লিমিট (₹${monthlyLimit.toLocaleString('en-IN')}) ছাড়িয়ে গেছে!`);
        setTimeout(() => setSyncToast(null), 6000);
      }
    }

    // Increment AdMob action counter for free users to display Interstitials
    if (!isPremium) {
      admobService.incrementAction((onClose) => {
        setIsAdMobInterstitialOpen(true);
        (window as any).onAdMobInterstitialClosed = onClose;
      });
    }
  };

  // Apply monthly carryover
  const handleApplyCarryover = async () => {
    if (!pendingCarryover || pendingCarryover <= 0) return;

    const openingTx: Transaction = {
      id: 'tx-opening-' + Date.now(),
      userId: activeUserId,
      type: 'income',
      amount: pendingCarryover,
      category: 'প্রারম্ভিক ব্যালেন্স (Opening)',
      note: `${now.toLocaleString('default', { month: 'long' })} মাসের পূর্ববর্তী উদ্বৃত্ত জের`,
      date: `${currentMonthKey}-01`,
      time: '00:01',
      syncedToSheet: false
    };

    if (sheetConfig.webAppUrl && sheetConfig.autoSync) {
      setIsSyncing(true);
      const ok = await pushToGoogleSheet(openingTx, sheetConfig.webAppUrl, activeUserId);
      setIsSyncing(false);
      if (ok) openingTx.syncedToSheet = true;
    }

    setTransactions((prev) => [openingTx, ...prev]);
    setSyncToast('পূর্ববর্তী মাসের উদ্বৃত্ত ব্যালেন্সে যোগ করা হয়েছে!');
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleAuthSuccess = async (user: AuthUser, needsPinSetup: boolean = false) => {
    lastActivityTimestampRef.current = Date.now();
    setCurrentUser(user);
    setSheetConfig((prev) => ({ ...prev, userId: user.email }));
    setIsBiometricLocked(false);
    const userIsPremium = getIsPremium(user.email);
    setIsPremiumState(userIsPremium);

    // 1. Central Admin Tracking: automatically send login metadata to central "Logins" sheet
    trackCentralLogin({
      email: user.email,
      name: user.name,
      timestamp: new Date().toISOString(),
      type: 'Login',
      isPremium: userIsPremium
    });

    // 2. Personal/Custom sheet sync if user configured one
    if (sheetConfig.webAppUrl) {
      pushDataToGoogleSheet('User', {
        timestamp: new Date().toISOString(),
        email: user.email,
        name: user.name,
        pin: user.pin || 'PENDING'
      }, sheetConfig.webAppUrl);
    }

    // 3. Post-Login Security: If new sign-in or PIN not set, trigger 4-digit PIN setup modal
    if (needsPinSetup || !user.pin || user.pin === '1234') {
      setPendingPinSetupUser(user);
    }
  };

  const handlePinSaved = (newPin: string) => {
    if (!currentUser) return;
    const updatedUser: AuthUser = { ...currentUser, pin: newPin };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updatedUser));

    // Update in registered users db
    try {
      const stored = localStorage.getItem('ft3d_registered_users_v2');
      const users: AuthUser[] = stored ? JSON.parse(stored) : [];
      const filtered = users.filter((u) => u.email.toLowerCase() !== currentUser.email.toLowerCase());
      filtered.push(updatedUser);
      localStorage.setItem('ft3d_registered_users_v2', JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to update pin in users db:', e);
    }

    // If biometric was already saved for this user, update user profile reference
    if (biometricConfig.enabled && biometricConfig.user?.email.toLowerCase() === currentUser.email.toLowerCase()) {
      setSavedBiometricConfig(true, updatedUser);
      setBiometricConfig({ enabled: true, user: updatedUser });
    }

    // Sync PIN to user sheet if configured
    if (sheetConfig.webAppUrl) {
      pushDataToGoogleSheet('User', {
        timestamp: new Date().toISOString(),
        email: updatedUser.email,
        name: updatedUser.name,
        pin: updatedUser.pin
      }, sheetConfig.webAppUrl);
    }

    setPendingPinSetupUser(null);
    setSyncToast('আপনার ৪-সংখ্যার সিক্রেট পিন সফলভাবে সংরক্ষিত হয়েছে! 🔐');
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleToggleBiometric = (enabled: boolean) => {
    if (!currentUser) return;
    if (enabled) {
      setSavedBiometricConfig(true, currentUser);
      setBiometricConfig({
        enabled: true,
        user: currentUser
      });
      setSyncToast('ফিঙ্গারপ্রিন্ট বায়োমেট্রিক নিরাপত্তা সফলভাবে চালু হয়েছে! 🔐');
    } else {
      setSavedBiometricConfig(false, null);
      setBiometricConfig({
        enabled: false,
        user: null
      });
      setSyncToast('ফিঙ্গারপ্রিন্ট বায়োমেট্রিক নিরাপত্তা বন্ধ করা হয়েছে');
    }
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleUpdatePin = (newPin: string) => {
    if (!currentUser) return;
    const updatedUser: AuthUser = { ...currentUser, pin: newPin };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updatedUser));

    try {
      const stored = localStorage.getItem('ft3d_registered_users_v2');
      const users: AuthUser[] = stored ? JSON.parse(stored) : [];
      const filtered = users.filter((u) => u.email.toLowerCase() !== currentUser.email.toLowerCase());
      filtered.push(updatedUser);
      localStorage.setItem('ft3d_registered_users_v2', JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to update pin in users db:', e);
    }

    if (biometricConfig.enabled && biometricConfig.user?.email.toLowerCase() === currentUser.email.toLowerCase()) {
      setSavedBiometricConfig(true, updatedUser);
      setBiometricConfig({ enabled: true, user: updatedUser });
    }

    setSyncToast('৪-সংখ্যার সিক্রেট পিন সফলভাবে পরিবর্তন করা হয়েছে! 🔑');
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setCurrentUser(null);
    setIsBiometricLocked(false);
    setPendingPinSetupUser(null);
    setActiveTab('home');
    setSyncToast('সফলভাবে লগআউট করা হয়েছে');
    setTimeout(() => setSyncToast(null), 2500);
  };

  const handleUpdatePhoto = (photoUrl: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, photoUrl };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updatedUser));

    try {
      const stored = localStorage.getItem('ft3d_registered_users_v2');
      if (stored) {
        const users: AuthUser[] = JSON.parse(stored);
        const filtered = users.filter(u => u.email.toLowerCase() !== currentUser.email.toLowerCase());
        filtered.push(updatedUser);
        localStorage.setItem('ft3d_registered_users_v2', JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('Failed to update photo in users database:', e);
    }

    setSyncToast('প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে! 📸');
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleDeleteTransaction = (id: string) => {
    const targetTx = transactions.find((t) => t.id === id);
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update transactions in storage after delete:', e);
      }
      return updated;
    });

    // If Google Sheet is connected, sync deletion action
    if (sheetConfig.webAppUrl && targetTx) {
      pushDataToGoogleSheet('Main', {
        action: 'delete',
        id: id,
        userId: targetTx.userId || activeUserId,
        type: targetTx.type,
        category: targetTx.category,
        amount: targetTx.amount,
        timestamp: new Date().toISOString()
      }, sheetConfig.webAppUrl).catch((err) => {
        console.warn('Google Sheet delete sync warning:', err);
      });
    }

    setSyncToast('লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে! 🗑️');
    setTimeout(() => setSyncToast(null), 2500);
  };

  const handleClearAll = () => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => (t.userId || '').toLowerCase() !== activeUserId.toLowerCase());
      try {
        localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to clear transactions in storage:', e);
      }
      return updated;
    });

    // If Google Sheet is connected, sync clear action
    if (sheetConfig.webAppUrl) {
      pushDataToGoogleSheet('Main', {
        action: 'clearAll',
        userId: activeUserId,
        timestamp: new Date().toISOString()
      }, sheetConfig.webAppUrl).catch((err) => {
        console.warn('Google Sheet clearAll sync warning:', err);
      });
    }

    setSyncToast('সমস্ত লেনদেনের রেকর্ড মুছে ফেলা হয়েছে! 🗑️');
    setTimeout(() => setSyncToast(null), 2500);
  };

  const handleResetToDemo = () => {
    const demoWithUser = INITIAL_TRANSACTIONS.map((t) => ({ ...t, userId: activeUserId }));
    setTransactions((prev) => [
      ...prev.filter((t) => (t.userId || '').toLowerCase() !== activeUserId.toLowerCase()),
      ...demoWithUser
    ]);
    setSyncToast('ডেমো ডেটা সফলভাবে রিলোড হয়েছে');
    setTimeout(() => setSyncToast(null), 2500);
  };

  const handleSyncAll = async () => {
    if (!sheetConfig.webAppUrl) {
      alert('অনুগ্রহ করে প্রথমে আপনার Google Apps Script Web App URL টি দিন।');
      return;
    }

    setIsSyncing(true);
    let successCount = 0;

    const updatedList = [...transactions];
    for (let i = 0; i < updatedList.length; i++) {
      const isThisUser = (updatedList[i].userId || '').toLowerCase() === activeUserId.toLowerCase();
      if (isThisUser && !updatedList[i].syncedToSheet) {
        const ok = await pushToGoogleSheet(updatedList[i], sheetConfig.webAppUrl, activeUserId);
        if (ok) {
          updatedList[i] = { ...updatedList[i], syncedToSheet: true };
          successCount++;
        }
      }
    }

    setTransactions(updatedList);
    setSheetConfig((prev) => ({ ...prev, lastSyncedAt: new Date().toLocaleTimeString() }));
    setIsSyncing(false);

    setSyncToast(
      successCount > 0
        ? `${successCount} টি এন্ট্রি ক্লাউডে সিঙ্ক সম্পন্ন হয়েছে!`
        : 'সমস্ত ডেটা ইতিমধ্যে সিঙ্ক রয়েছে!'
    );
    setTimeout(() => setSyncToast(null), 3500);
  };

  // If Biometric Lock is active, display Biometric Unlock Screen
  if (isBiometricLocked && (currentUser || (biometricConfig.enabled && biometricConfig.user))) {
    const lockUser = currentUser || biometricConfig.user!;
    return (
      <BiometricUnlockScreen
        savedUser={lockUser}
        onUnlockSuccess={(user) => {
          lastActivityTimestampRef.current = Date.now();
          setCurrentUser(user);
          setIsBiometricLocked(false);
          setSheetConfig((prev) => ({ ...prev, userId: user.email }));
          setIsPremiumState(getIsPremium(user.email));
          setSyncToast(`ফিঙ্গারপ্রিন্ট দিয়ে আনলক সফল! স্বাগতম ${user.name}`);
          setTimeout(() => setSyncToast(null), 3000);
        }}
        onSwitchToPassword={() => {
          lastActivityTimestampRef.current = Date.now();
          setIsBiometricLocked(false);
        }}
        onSwitchAccount={() => {
          lastActivityTimestampRef.current = Date.now();
          setIsBiometricLocked(false);
          setCurrentUser(null);
        }}
      />
    );
  }

  // If user is not authenticated, display clean Login / Sign-up Screen
  if (!currentUser) {
    return (
      <AuthScreen
        webAppUrl={sheetConfig.webAppUrl}
        onAuthSuccess={handleAuthSuccess}
        onTriggerBiometricUnlock={() => {
          if (biometricConfig.enabled && biometricConfig.user) {
            setIsBiometricLocked(true);
          }
        }}
        defaultEmail={sheetConfig.userId || DEFAULT_USER_ID}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-32 overflow-x-hidden">
      {/* Top Header with User Info, Go Premium Button & Logout Button */}
      <Header
        currentUser={currentUser}
        isBiometricEnabled={biometricConfig.enabled}
        onLockApp={() => setIsBiometricLocked(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setActiveTab('profile')}
        syncSuccessMessage={syncToast}
        isPremium={isPremium}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
      />

      {/* Main Responsive Fluid Container */}
      <main className="w-full max-w-xl mx-auto px-3.5 sm:px-5 pt-4 sm:pt-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Offline Status & Pending Cloud Sync Indicator */}
        <OfflineIndicator
          isOnline={isOnline}
          unsyncedCount={unsyncedTransactions.length}
          isSyncing={isSyncing}
          onManualSync={handleSyncAll}
        />

        {activeTab === 'home' && (
          <>
            {/* Balance Card with 3D Effect & userId & Monthly Carryover */}
            <BalanceCard
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              transactionCount={userTransactions.length}
              userId={activeUserId}
              previousMonthCarryover={pendingCarryover}
              onApplyCarryover={handleApplyCarryover}
            />

            {/* Monthly Expense Budget Limit Widget */}
            <BudgetLimitCard
              currentMonthExpense={currentMonthExpense}
              monthlyLimit={monthlyLimit}
              onUpdateLimit={handleUpdateLimit}
            />

            {/* Quick Action Toolbar (Google Sheet Sync, Export/PDF, Bill Reminders, Go Premium) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setIsSheetModalOpen(true)}
                className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-indigo-500/30 text-indigo-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all shadow-md active:scale-95 group cursor-pointer min-w-0"
              >
                <Cloud className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">শীট সিঙ্ক</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-emerald-500/30 text-emerald-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all shadow-md active:scale-95 group cursor-pointer min-w-0"
              >
                <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">রিপোর্ট/PDF</span>
                {!isPremium && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setIsBillReminderOpen(true)}
                className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/30 text-amber-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all shadow-md active:scale-95 group cursor-pointer min-w-0"
              >
                <CalendarClock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">বিল রিমাইন্ডার</span>
              </button>

              {!isPremium ? (
                <button
                  type="button"
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-black shadow-md shadow-amber-500/30 transition-all active:scale-95 animate-pulse cursor-pointer min-w-0"
                >
                  <Crown className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span className="truncate">VIP (₹99)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer min-w-0"
                >
                  <Crown className="w-4 h-4 fill-amber-400/30 text-amber-400 shrink-0" />
                  <span className="truncate">VIP Member</span>
                </button>
              )}
            </div>

            {/* Transaction Entry Form */}
            <TransactionForm
              categories={DEFAULT_CATEGORIES}
              onSubmitTransaction={handleAddTransaction}
              isSyncing={isSyncing}
            />

            {/* Compact Transaction History List with Pagination / Show Recent */}
            <TransactionList
              transactions={userTransactions}
              categories={DEFAULT_CATEGORIES}
              onDeleteTransaction={handleDeleteTransaction}
              onClearAll={handleClearAll}
            />

            {/* Bottom Ad Banner for Free Users */}
            {!isPremium && (
              <AdBanner
                position="bottom-feed"
                onUpgradeClick={() => setIsPremiumModalOpen(true)}
                isPremium={isPremium}
              />
            )}
          </>
        )}

        {activeTab === 'analytics' && (
          /* Dedicated Analytics & Graphical Reports Tab */
          <AnalyticsReportsView
            transactions={userTransactions}
            categories={DEFAULT_CATEGORIES}
            isPremium={isPremium}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onOpenExport={() => setIsExportModalOpen(true)}
            monthlyLimit={monthlyLimit}
          />
        )}

        {activeTab === 'support' && (
          /* Support & Feedback Tab View */
          <SupportView
            webAppUrl={sheetConfig.webAppUrl}
            userId={activeUserId}
            userName={currentUser?.name || ''}
            onFeedbackSubmitted={async (fb) => {
              setSyncToast('রিভিউ ও রেটিং সফলভাবে সংরক্ষিত হয়েছে! ⭐');
              
              // 1. Central Admin Tracking: automatically send review to central "Reviews" sheet
              trackCentralReview({
                userId: activeUserId,
                name: currentUser?.name || 'User',
                rating: fb.rating || 5,
                comment: fb.comment || fb.review || '',
                timestamp: new Date().toISOString()
              });

              // 2. Personal/Custom sheet if user configured one
              if (sheetConfig.webAppUrl) {
                await pushDataToGoogleSheet('Review', {
                  sheetName: 'Review',
                  ...fb
                }, sheetConfig.webAppUrl);
              }
              setTimeout(() => setSyncToast(null), 3000);
            }}
          />
        )}

        {activeTab === 'profile' && (
          /* Profile Tab View */
          <ProfileView
            currentUser={currentUser}
            transactionCount={userTransactions.length}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
            isBiometricEnabled={biometricConfig.enabled}
            onToggleBiometric={handleToggleBiometric}
            onUpdatePin={handleUpdatePin}
            onLogout={handleLogout}
            onLockApp={() => setIsBiometricLocked(true)}
            isPremium={isPremium}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onUpdatePhoto={handleUpdatePhoto}
          />
        )}

        {/* Footer Credit & Branding */}
        <Footer />
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        transactionCount={userTransactions.length}
      />

      {/* Setup 4-Digit PIN Modal Prompt after Google Sign-In */}
      {pendingPinSetupUser && (
        <PinSetupModal
          isOpen={Boolean(pendingPinSetupUser)}
          user={pendingPinSetupUser}
          onPinSaved={handlePinSaved}
          onClose={() => setPendingPinSetupUser(null)}
          isMandatory={!pendingPinSetupUser.pin}
        />
      )}

      {/* Google Sheet Sync Modal */}
      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        config={sheetConfig}
        onSaveConfig={setSheetConfig}
        onSyncAll={handleSyncAll}
        isSyncing={isSyncing}
        totalTransactionsCount={userTransactions.length}
        unsyncedCount={unsyncedTransactions.length}
      />

      {/* Export / Backup Modal (Feature Gated with PDF & Excel unlock) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={userTransactions}
        onImportTransactions={(imported) => setTransactions(imported)}
        onResetToDemo={handleResetToDemo}
        isPremium={isPremium}
        onOpenPremium={() => {
          setIsExportModalOpen(false);
          setIsPremiumModalOpen(true);
        }}
        userName={currentUser?.name}
        userEmail={currentUser?.email}
      />

      {/* Smart Bill Reminders Modal (Feature Gated with VIP Unlimited alerts) */}
      <BillReminderModal
        isOpen={isBillReminderOpen}
        onClose={() => setIsBillReminderOpen(false)}
        userId={activeUserId}
        isPremium={isPremium}
        onOpenPremium={() => {
          setIsBillReminderOpen(false);
          setIsPremiumModalOpen(true);
        }}
      />

      {/* Go Premium Subscription & Upgrade Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onSuccess={() => {
          setIsPremiumState(true);
          setSyncToast('👑 অভিনন্দন! আপনি এখন VIP Lifetime Pro মেম্বার!');
          setTimeout(() => setSyncToast(null), 4000);
        }}
        userId={currentUser?.email}
      />

      {/* Google AdMob Interstitial Ad Modal */}
      <AdMobInterstitial
        isOpen={isAdMobInterstitialOpen}
        onClose={() => {
          setIsAdMobInterstitialOpen(false);
          const cb = (window as any).onAdMobInterstitialClosed;
          if (typeof cb === 'function') {
            cb();
          }
        }}
        onUpgradeClick={() => {
          setIsPremiumModalOpen(true);
        }}
      />
    </div>
  );
}
