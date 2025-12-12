import { ExpirationStatus, NATURAL_EXPIRATION_ESTIMATES, FoodCategory } from '@/types';
import { differenceInDays, isBefore, startOfDay, addDays } from 'date-fns';

export const getExpirationStatus = (expirationDate: Date): ExpirationStatus => {
  const today = startOfDay(new Date());
  const expDate = startOfDay(expirationDate);
  
  if (isBefore(expDate, today)) {
    return 'expired';
  }
  
  const daysUntilExpiration = differenceInDays(expDate, today);
  
  if (daysUntilExpiration <= 3) {
    return 'expiring';
  }
  
  return 'fresh';
};

export const getDaysUntilExpiration = (expirationDate: Date): number => {
  const today = startOfDay(new Date());
  const expDate = startOfDay(expirationDate);
  return differenceInDays(expDate, today);
};

export const getStatusLabel = (status: ExpirationStatus): string => {
  switch (status) {
    case 'expired':
      return 'Vencido';
    case 'expiring':
      return 'Urgente!';
    case 'fresh':
      return 'OK';
  }
};

export const getStatusColor = (status: ExpirationStatus): string => {
  switch (status) {
    case 'expired':
      return 'status-expired';
    case 'expiring':
      return 'status-expiring';
    case 'fresh':
      return 'status-fresh';
  }
};

// Verifica se a categoria é de produto natural/perecível
export const isNaturalCategory = (category: FoodCategory): boolean => {
  const naturalCategories: FoodCategory[] = [
    'Fruta',
    'Legume', 
    'Verdura',
    'Laticínio',
    'Carne',
  ];
  return naturalCategories.includes(category);
};

// Estima a data de validade para produtos naturais
export const estimateExpirationDate = (productName: string, category: FoodCategory): Date => {
  const today = new Date();
  const lowerName = productName.toLowerCase().trim();
  
  // Verifica se há uma estimativa específica para o produto
  for (const [product, days] of Object.entries(NATURAL_EXPIRATION_ESTIMATES)) {
    if (lowerName.includes(product.toLowerCase())) {
      return addDays(today, days);
    }
  }
  
  // Estimativas padrão por categoria
  const defaultDays: Record<FoodCategory, number> = {
    'Fruta': 7,
    'Legume': 10,
    'Verdura': 5,
    'Laticínio': 7,
    'Carne': 3,
    'Industrializado': 180,
    'Grão': 90,
    'Bebida': 30,
    'Congelado': 90,
    'Tempero': 180,
    'Outro': 14,
  };
  
  return addDays(today, defaultDays[category] || 7);
};

// Gera estimativa de preço baseado no nome do produto
export const estimatePrice = (productName: string): number => {
  const lowerName = productName.toLowerCase();
  
  const priceMap: Record<string, number> = {
    'banana': 5,
    'maçã': 8,
    'laranja': 6,
    'tomate': 7,
    'alface': 4,
    'leite': 6,
    'queijo': 25,
    'frango': 18,
    'carne': 35,
    'peixe': 30,
    'iogurte': 8,
    'pão': 10,
    'ovo': 15,
    'arroz': 8,
    'feijão': 10,
    'macarrão': 5,
    'óleo': 8,
    'manteiga': 12,
    'presunto': 15,
    'limão': 4,
    'cebola': 5,
    'batata': 6,
    'cenoura': 5,
  };
  
  for (const [product, price] of Object.entries(priceMap)) {
    if (lowerName.includes(product)) {
      return price;
    }
  }
  
  return 10; // Preço padrão estimado
};
