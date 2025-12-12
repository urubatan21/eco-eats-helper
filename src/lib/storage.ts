import { FoodItem, ShoppingItem } from '@/types';

const STORAGE_KEYS = {
  FOOD_ITEMS: 'zerodesperdicio_items',
  SHOPPING_LIST: 'zerodesperdicio_shopping',
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
