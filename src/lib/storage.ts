import { FoodItem, ShoppingItem, Challenge, MonthlyStats, Notification } from '@/types';

const STORAGE_KEYS = {
  FOOD_ITEMS: 'ecobuddy_items',
  SHOPPING_LIST: 'ecobuddy_shopping',
  CHALLENGES: 'ecobuddy_challenges',
  MONTHLY_STATS: 'ecobuddy_stats',
  NOTIFICATIONS: 'ecobuddy_notifications',
  MEDALS: 'ecobuddy_medals',
} as const;

export const loadFoodItems = (): FoodItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    if (!data) return [];
    const items = JSON.parse(data);
    return items.map((item: any) => ({
      ...item,
      expirationDate: new Date(item.expirationDate),
      addedAt: new Date(item.addedAt),
    }));
  } catch {
    return [];
  }
};

export const saveFoodItems = (items: FoodItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
};

export const loadShoppingList = (): ShoppingItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveShoppingList = (items: ShoppingItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items));
};

export const loadChallenges = (): Challenge[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveChallenges = (challenges: Challenge[]): void => {
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
};

export const loadMonthlyStats = (): MonthlyStats[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MONTHLY_STATS);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveMonthlyStats = (stats: MonthlyStats[]): void => {
  localStorage.setItem(STORAGE_KEYS.MONTHLY_STATS, JSON.stringify(stats));
};

export const loadNotifications = (): Notification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) return [];
    const notifications = JSON.parse(data);
    return notifications.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
    }));
  } catch {
    return [];
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const loadMedals = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEDALS);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveMedals = (medals: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.MEDALS, JSON.stringify(medals));
};

// Atualiza estatísticas mensais
export const updateMonthlyStats = (action: 'added' | 'consumed' | 'wasted'): void => {
  const stats = loadMonthlyStats();
  const now = new Date();
  const currentMonth = now.toLocaleString('pt-BR', { month: 'long' });
  const currentYear = now.getFullYear();
  
  let monthStats = stats.find(s => s.month === currentMonth && s.year === currentYear);
  
  if (!monthStats) {
    monthStats = {
      month: currentMonth,
      year: currentYear,
      totalAdded: 0,
      consumed: 0,
      wasted: 0,
    };
    stats.push(monthStats);
  }
  
  switch (action) {
    case 'added':
      monthStats.totalAdded++;
      break;
    case 'consumed':
      monthStats.consumed++;
      break;
    case 'wasted':
      monthStats.wasted++;
      break;
  }
  
  saveMonthlyStats(stats);
};
