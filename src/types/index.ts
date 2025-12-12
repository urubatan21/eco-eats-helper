export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  category: string;
  addedAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  prepTime: string;
}

export type ExpirationStatus = 'fresh' | 'expiring' | 'expired';

export const FOOD_CATEGORIES = [
  'Frutas',
  'Verduras',
  'Legumes',
  'Laticínios',
  'Carnes',
  'Grãos',
  'Congelados',
  'Bebidas',
  'Outros',
] as const;

export const UNITS = [
  'un',
  'kg',
  'g',
  'L',
  'ml',
  'pacote',
  'caixa',
  'dúzia',
] as const;
