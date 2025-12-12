import { FoodItem, Notification } from '@/types';
import { getDaysUntilExpiration, estimatePrice } from './expiration';
import { loadNotifications, saveNotifications } from './storage';

type NotificationType = 'financial' | 'chef' | 'personification';

interface NotificationTemplate {
  type: NotificationType;
  title: string;
  body: string;
  cta: string;
}

// Templates de notificação por tipo
const getFinancialNotification = (item: FoodItem, daysLeft: number): NotificationTemplate => {
  const price = item.estimatedPrice || estimatePrice(item.name);
  return {
    type: 'financial',
    title: '💸 Dinheiro indo pro lixo!',
    body: `Seu ${item.name} (aprox. R$ ${price}) vence em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}. Que tal usar hoje?`,
    cta: 'Ver Receita',
  };
};

const getChefNotification = (item: FoodItem, daysLeft: number): NotificationTemplate => {
  const recipes: Record<string, string> = {
    'tomate': 'molho caseiro',
    'banana': 'bolo de banana',
    'leite': 'pudim cremoso',
    'frango': 'frango grelhado',
    'queijo': 'sanduíche gourmet',
    'ovo': 'omelete especial',
    'batata': 'purê delicioso',
    'carne': 'strogonoff',
    'limão': 'limonada ou torta',
    'maçã': 'torta de maçã',
  };
  
  const lowerName = item.name.toLowerCase();
  let suggestion = 'uma receita especial';
  
  for (const [key, recipe] of Object.entries(recipes)) {
    if (lowerName.includes(key)) {
      suggestion = recipe;
      break;
    }
  }
  
  return {
    type: 'chef',
    title: '🍝 O jantar está resolvido!',
    body: `${item.name} quase vencendo? O Chef IA sugere um ${suggestion}!`,
    cta: 'Ver modo de preparo',
  };
};

const getPersonificationNotification = (item: FoodItem, daysLeft: number): NotificationTemplate => {
  const messages: Record<string, { emoji: string; cry: string; suggestion: string }> = {
    'tomate': { emoji: '🍅', cry: 'Estou ficando enrugado...', suggestion: 'Viro um molho incrível' },
    'banana': { emoji: '🍌', cry: 'Estou ficando pretinha...', suggestion: 'Viro um bolo delicioso' },
    'alface': { emoji: '🥬', cry: 'Estou murchando...', suggestion: 'Viro uma salada refrescante' },
    'maçã': { emoji: '🍎', cry: 'Estou perdendo meu brilho...', suggestion: 'Viro uma torta caseira' },
    'limão': { emoji: '🍋', cry: 'Estou ressecando...', suggestion: 'Viro uma limonada gelada' },
    'queijo': { emoji: '🧀', cry: 'Estou ficando duro...', suggestion: 'Viro um sanduíche quente' },
    'leite': { emoji: '🥛', cry: 'Estou azedando...', suggestion: 'Viro um mingau ou vitamina' },
    'ovo': { emoji: '🥚', cry: 'Estou perdendo frescor...', suggestion: 'Viro uma omelete recheada' },
  };
  
  const lowerName = item.name.toLowerCase();
  let template = { emoji: '🍽️', cry: 'Não me deixe estragar...', suggestion: 'Me use hoje' };
  
  for (const [key, msg] of Object.entries(messages)) {
    if (lowerName.includes(key)) {
      template = msg;
      break;
    }
  }
  
  return {
    type: 'personification',
    title: `${template.emoji} "Não me deixe morrer!" - ass: ${item.name}`,
    body: `${template.cry} ${template.suggestion} se você me usar até ${daysLeft === 0 ? 'hoje' : daysLeft === 1 ? 'amanhã' : `em ${daysLeft} dias`}!`,
    cta: `Salvar ${item.name}`,
  };
};

// Gera notificação com tipo aleatório para variedade
export const generateNotification = (item: FoodItem): Notification | null => {
  const daysLeft = getDaysUntilExpiration(item.expirationDate);
  
  // Só gera notificação para itens que vencem em até 3 dias
  if (daysLeft > 3 || daysLeft < 0) return null;
  
  const types: NotificationType[] = ['financial', 'chef', 'personification'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  let template: NotificationTemplate;
  
  switch (randomType) {
    case 'financial':
      template = getFinancialNotification(item, daysLeft);
      break;
    case 'chef':
      template = getChefNotification(item, daysLeft);
      break;
    case 'personification':
      template = getPersonificationNotification(item, daysLeft);
      break;
  }
  
  return {
    id: crypto.randomUUID(),
    type: template.type,
    title: template.title,
    body: template.body,
    itemId: item.id,
    cta: template.cta,
    read: false,
    createdAt: new Date(),
  };
};

// Gera notificações para todos os itens próximos do vencimento
export const generateAllNotifications = (items: FoodItem[]): Notification[] => {
  const existingNotifications = loadNotifications();
  const newNotifications: Notification[] = [];
  
  const expiringItems = items.filter(item => {
    const daysLeft = getDaysUntilExpiration(item.expirationDate);
    return daysLeft >= 0 && daysLeft <= 3 && item.status === 'em_estoque';
  });
  
  for (const item of expiringItems) {
    // Verifica se já existe notificação para este item nas últimas 24h
    const hasRecentNotification = existingNotifications.some(
      n => n.itemId === item.id && 
           new Date().getTime() - new Date(n.createdAt).getTime() < 24 * 60 * 60 * 1000
    );
    
    if (!hasRecentNotification) {
      const notification = generateNotification(item);
      if (notification) {
        newNotifications.push(notification);
      }
    }
  }
  
  if (newNotifications.length > 0) {
    saveNotifications([...newNotifications, ...existingNotifications].slice(0, 50));
  }
  
  return newNotifications;
};
