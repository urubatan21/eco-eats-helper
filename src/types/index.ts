export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  expirationDate: Date;
  status: ItemStatus;
  addedAt: Date;
  estimatedPrice?: number;
  isNatural: boolean; // true = perecível natural, false = industrializado
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
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export interface Challenge {
  id: string;
  itemName: string;
  quantity: number;
  daysLeft: number;
  recipeSuggestion: string;
  medal: string;
  isCompleted: boolean;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalAdded: number;
  consumed: number;
  wasted: number;
}

export interface Notification {
  id: string;
  type: 'financial' | 'chef' | 'personification';
  title: string;
  body: string;
  itemId: string;
  cta: string;
  read: boolean;
  createdAt: Date;
}

export type ItemStatus = 'em_estoque' | 'consumido' | 'desperdicado';

export type FoodCategory = 
  | 'Industrializado'
  | 'Fruta'
  | 'Legume'
  | 'Verdura'
  | 'Laticínio'
  | 'Carne'
  | 'Grão'
  | 'Bebida'
  | 'Congelado'
  | 'Tempero'
  | 'Outro';

export type ExpirationStatus = 'fresh' | 'expiring' | 'expired';

export const FOOD_CATEGORIES: FoodCategory[] = [
  'Industrializado',
  'Fruta',
  'Legume',
  'Verdura',
  'Laticínio',
  'Carne',
  'Grão',
  'Bebida',
  'Congelado',
  'Tempero',
  'Outro',
];

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

// Estimativas de validade para produtos naturais (em dias)
export const NATURAL_EXPIRATION_ESTIMATES: Record<string, number> = {
  // Frutas
  'banana': 7,
  'maçã': 14,
  'laranja': 10,
  'limão': 14,
  'morango': 5,
  'uva': 7,
  'mamão': 5,
  'manga': 7,
  'abacate': 5,
  'melancia': 7,
  'melão': 7,
  'pêra': 7,
  'pêssego': 5,
  'abacaxi': 5,
  'kiwi': 7,
  
  // Verduras
  'alface': 5,
  'rúcula': 4,
  'espinafre': 5,
  'couve': 7,
  'agrião': 4,
  'salsinha': 7,
  'cebolinha': 7,
  'coentro': 5,
  
  // Legumes
  'tomate': 7,
  'cenoura': 14,
  'batata': 21,
  'cebola': 30,
  'alho': 30,
  'pepino': 7,
  'abobrinha': 7,
  'berinjela': 7,
  'pimentão': 7,
  'brócolis': 5,
  'couve-flor': 7,
  'beterraba': 14,
  
  // Laticínios naturais
  'queijo fresco': 7,
  'ricota': 7,
  'iogurte natural': 10,
  
  // Carnes frescas
  'frango': 3,
  'carne bovina': 3,
  'carne suína': 3,
  'peixe': 2,
  'camarão': 2,
};

// Preços estimados para cálculo de desperdício
export const ESTIMATED_PRICES: Record<string, number> = {
  'banana': 5,
  'maçã': 8,
  'tomate': 7,
  'alface': 4,
  'leite': 6,
  'queijo': 25,
  'frango': 15,
  'carne': 35,
  'peixe': 30,
  'iogurte': 8,
  'pão': 10,
  'ovo': 15,
};
