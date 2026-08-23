import { setIsPremium } from './premium';

export interface ReferralChainLevel {
  level: number;
  title: string;
  titleBn: string;
  memberCount: number;
  unlocked: boolean;
  requiredForNext: number;
  rewardTier: string;
  rewardTierBn: string;
  unlockedAt?: string;
}

export interface ReferralMember {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  level: number;
  photoUrl?: string;
  status: 'active' | 'synced';
}

export interface ReferralNetworkState {
  referralCode: string;
  totalMembers: number;
  currentLevel: number; // 1 to 50
  level50Unlocked: boolean;
  vip6MonthsClaimed: boolean;
  vip6MonthsClaimedAt?: string;
  vipExpiresAt?: string;
  levels: ReferralChainLevel[];
  recentMembers: ReferralMember[];
}

const STORAGE_PREFIX = 'ft3d_referral_network_v1_';

export function generateReferralCode(userId: string, userName: string = 'USER'): string {
  const cleanName = userName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'EXP';
  const cleanId = userId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || '88';
  return `REF-${cleanName}-${cleanId}`;
}

export function createInitial50Levels(): ReferralChainLevel[] {
  const levels: ReferralChainLevel[] = [];

  for (let i = 1; i <= 50; i++) {
    let rewardTier = `Level ${i} Chain Point`;
    let rewardTierBn = `লেভেল ${i} চেইন পয়েন্ট`;

    if (i === 5) {
      rewardTier = 'Pro Theme Badge';
      rewardTierBn = 'প্রো থিম ব্যাজ';
    } else if (i === 10) {
      rewardTier = 'Bronze Ambassador';
      rewardTierBn = 'ব্রোঞ্জ অ্যাম্বাসেডর ব্যাজ';
    } else if (i === 20) {
      rewardTier = 'Silver Chain Champion';
      rewardTierBn = 'সিলভার চেইন চ্যাম্পিয়ন';
    } else if (i === 35) {
      rewardTier = 'Gold Network Leader';
      rewardTierBn = 'গোল্ড নেটওয়ার্ক লিডার';
    } else if (i === 50) {
      rewardTier = '👑 6-Month FREE VIP Subscription';
      rewardTierBn = '👑 ৬ মাসের ফ্রি ভিআইপি সাবস্ক্রিপশন';
    }

    levels.push({
      level: i,
      title: i === 1 ? 'Direct Referrals' : `Tier ${i} Sub-Chain`,
      titleBn: i === 1 ? '১ম লেভেল সরাসরি রেফারেল' : `${i}-তম লেভেল সাব-চেইন`,
      memberCount: i <= 3 ? (4 - i) * 2 : 0,
      unlocked: i <= 3,
      requiredForNext: 1,
      rewardTier,
      rewardTierBn,
      unlockedAt: i <= 3 ? '2026-08-20' : undefined,
    });
  }

  return levels;
}

const INITIAL_MEMBERS: ReferralMember[] = [
  {
    id: 'mem-1',
    name: 'Rahim Ahmed',
    email: 'rahim.ahmed@example.com',
    joinedDate: '2026-08-21',
    level: 1,
    status: 'active',
  },
  {
    id: 'mem-2',
    name: 'Sourav Mondal',
    email: 'sourav.m@example.com',
    joinedDate: '2026-08-21',
    level: 1,
    status: 'active',
  },
  {
    id: 'mem-3',
    name: 'Priyanka Das',
    email: 'priyanka.d@example.com',
    joinedDate: '2026-08-22',
    level: 2,
    status: 'active',
  },
  {
    id: 'mem-4',
    name: 'Amit Sharma',
    email: 'amit.s@example.com',
    joinedDate: '2026-08-22',
    level: 2,
    status: 'active',
  },
  {
    id: 'mem-5',
    name: 'Bikram Sen',
    email: 'bikram.sen@example.com',
    joinedDate: '2026-08-23',
    level: 3,
    status: 'active',
  },
];

export function getReferralNetwork(userId: string, userName: string = 'User'): ReferralNetworkState {
  if (!userId) {
    return {
      referralCode: 'REF-USER-7700',
      totalMembers: 5,
      currentLevel: 3,
      level50Unlocked: false,
      vip6MonthsClaimed: false,
      levels: createInitial50Levels(),
      recentMembers: INITIAL_MEMBERS,
    };
  }

  try {
    const key = `${STORAGE_PREFIX}${userId.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: ReferralNetworkState = JSON.parse(raw);
      // Ensure all 50 levels exist
      if (!parsed.levels || parsed.levels.length < 50) {
        parsed.levels = createInitial50Levels();
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load referral network:', e);
  }

  const initialCode = generateReferralCode(userId, userName);
  const initialState: ReferralNetworkState = {
    referralCode: initialCode,
    totalMembers: 5,
    currentLevel: 3,
    level50Unlocked: false,
    vip6MonthsClaimed: false,
    levels: createInitial50Levels(),
    recentMembers: INITIAL_MEMBERS,
  };

  saveReferralNetwork(userId, initialState);
  return initialState;
}

export function saveReferralNetwork(userId: string, state: ReferralNetworkState): void {
  if (!userId) return;
  try {
    const key = `${STORAGE_PREFIX}${userId.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save referral network:', e);
  }
}

/**
 * Claim the Level 50 VIP Subscription reward
 */
export function claimLevel50VipReward(userId: string, userEmail: string): { success: boolean; message: string } {
  const state = getReferralNetwork(userId);
  
  if (state.currentLevel < 50) {
    return {
      success: false,
      message: `আপনি এখনো ৫০-তম লেভেলে পৌঁছাননি। বর্তমান লেভেল: ${state.currentLevel}/৫০`,
    };
  }

  // Calculate 6-month expiry date
  const now = new Date();
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(now.getMonth() + 6);

  state.vip6MonthsClaimed = true;
  state.vip6MonthsClaimedAt = now.toISOString();
  state.vipExpiresAt = sixMonthsLater.toISOString();
  state.level50Unlocked = true;

  saveReferralNetwork(userId, state);

  // Activate VIP Premium status in system
  setIsPremium(userEmail, true);

  return {
    success: true,
    message: 'অভিনন্দন! আপনার ৬ মাসের ফ্রি ভিআইপি মেম্বারশিপ সফলভাবে আনলক হয়েছে! 👑',
  };
}

/**
 * Add a new simulated or real direct referral
 */
export function addReferralMember(
  userId: string,
  userName: string,
  targetLevel: number = 1
): ReferralNetworkState {
  const state = getReferralNetwork(userId);
  const safeLevel = Math.min(Math.max(1, targetLevel), 50);

  const newMember: ReferralMember = {
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: userName || `Network Partner #${state.totalMembers + 1}`,
    email: `${(userName || 'partner').toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 900 + 100)}@gmail.com`,
    joinedDate: new Date().toISOString().split('T')[0],
    level: safeLevel,
    status: 'active',
  };

  state.recentMembers = [newMember, ...state.recentMembers.slice(0, 19)];
  state.totalMembers += 1;

  // Update level stats
  const levelIdx = safeLevel - 1;
  if (state.levels[levelIdx]) {
    state.levels[levelIdx].memberCount += 1;
    state.levels[levelIdx].unlocked = true;
    state.levels[levelIdx].unlockedAt = new Date().toISOString().split('T')[0];
  }

  // Check if we can unlock higher levels
  if (safeLevel > state.currentLevel) {
    state.currentLevel = safeLevel;
  } else if (state.currentLevel < 50 && state.totalMembers % 2 === 0) {
    state.currentLevel = Math.min(50, state.currentLevel + 1);
    const nextIdx = state.currentLevel - 1;
    if (state.levels[nextIdx]) {
      state.levels[nextIdx].unlocked = true;
      state.levels[nextIdx].memberCount = Math.max(1, state.levels[nextIdx].memberCount + 1);
      state.levels[nextIdx].unlockedAt = new Date().toISOString().split('T')[0];
    }
  }

  if (state.currentLevel >= 50) {
    state.level50Unlocked = true;
  }

  saveReferralNetwork(userId, state);
  return state;
}

/**
 * Simulate progressing through levels up to Level 50
 */
export function simulateLevelJump(userId: string, targetLevel: number = 50): ReferralNetworkState {
  const state = getReferralNetwork(userId);
  const target = Math.min(50, Math.max(1, targetLevel));

  state.currentLevel = target;
  state.totalMembers = Math.max(state.totalMembers, target * 2 + 5);

  for (let i = 0; i < target; i++) {
    state.levels[i].unlocked = true;
    if (state.levels[i].memberCount === 0) {
      state.levels[i].memberCount = Math.floor(Math.random() * 3) + 1;
    }
    if (!state.levels[i].unlockedAt) {
      state.levels[i].unlockedAt = new Date().toISOString().split('T')[0];
    }
  }

  if (target >= 50) {
    state.level50Unlocked = true;
  }

  saveReferralNetwork(userId, state);
  return state;
}

export function getShareUrl(referralCode: string): string {
  const origin = window.location.origin;
  return `${origin}/?ref=${encodeURIComponent(referralCode)}`;
}

export function getShareMessage(referralCode: string, userName?: string): string {
  return `🎉 Daily Expense হিসাব খাতা অ্যাপে যোগ দিন! আমার রেফারেল কোড: *${referralCode}* ব্যবহার করে জয়েন করুন এবং ৫০-লেভেল চেইন আনলক করে জিতে নিন ৬ মাসের ফ্রি ভিআইপি মেম্বারশিপ (6-Month Free VIP Subscription)! লিংক: ${getShareUrl(referralCode)}`;
}
