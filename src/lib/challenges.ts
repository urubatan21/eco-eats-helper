import { FoodItem, Challenge } from '@/types';
import { getDaysUntilExpiration } from './expiration';
import { loadChallenges, saveChallenges, loadMedals, saveMedals } from './storage';

// Mapeamento de ingredientes para medalhas e receitas
const CHALLENGE_CONFIG: Record<string, { medal: string; recipe: string }> = {
  'limão': { medal: 'Mestre Cítrico 🍋', recipe: 'Torta de limão' },
  'banana': { medal: 'Rei das Bananas 🍌', recipe: 'Bolo de banana com canela' },
  'tomate': { medal: 'Chef Italiano 🍅', recipe: 'Molho de tomate caseiro' },
  'ovo': { medal: 'Mestre dos Ovos 🥚', recipe: 'Quiche ou fritada' },
  'leite': { medal: 'Leiteiro Supremo 🥛', recipe: 'Pudim ou mingau' },
  'maçã': { medal: 'Guardião das Maçãs 🍎', recipe: 'Torta ou compota' },
  'batata': { medal: 'Rei da Batata 🥔', recipe: 'Nhoque ou purê especial' },
  'queijo': { medal: 'Mestre Queijeiro 🧀', recipe: 'Fondue ou sanduíche gourmet' },
  'frango': { medal: 'Chef de Frango 🍗', recipe: 'Estrogonofe ou frango assado' },
  'carne': { medal: 'Churrasqueiro Master 🥩', recipe: 'Carne assada ou picadinho' },
  'laranja': { medal: 'Mestre Vitamina C 🍊', recipe: 'Suco natural ou bolo' },
  'morango': { medal: 'Rei dos Morangos 🍓', recipe: 'Mousse ou salada de frutas' },
  'cenoura': { medal: 'Olhos de Águia 🥕', recipe: 'Bolo de cenoura' },
  'abacate': { medal: 'Guacamole Master 🥑', recipe: 'Guacamole ou vitamina' },
};

// Detecta se há desafio disponível baseado no estoque
export const detectChallenge = (items: FoodItem[]): Challenge | null => {
  // Agrupa itens por nome
  const itemsByName: Record<string, FoodItem[]> = {};
  
  for (const item of items) {
    if (item.status !== 'em_estoque') continue;
    
    const daysLeft = getDaysUntilExpiration(item.expirationDate);
    if (daysLeft > 3 || daysLeft < 0) continue;
    
    const lowerName = item.name.toLowerCase();
    if (!itemsByName[lowerName]) {
      itemsByName[lowerName] = [];
    }
    itemsByName[lowerName].push(item);
  }
  
  // Verifica condições de desafio: quantidade > 3 itens do mesmo tipo OU item próximo do vencimento
  for (const [name, itemsGroup] of Object.entries(itemsByName)) {
    const totalQuantity = itemsGroup.reduce((sum, item) => sum + item.quantity, 0);
    const minDaysLeft = Math.min(...itemsGroup.map(item => getDaysUntilExpiration(item.expirationDate)));
    
    // Condição: quantidade >= 3 OU vence em até 2 dias
    if (totalQuantity >= 3 || minDaysLeft <= 2) {
      // Busca configuração do desafio
      let config = { medal: 'Chef Sustentável 🌱', recipe: 'Receita criativa' };
      
      for (const [key, value] of Object.entries(CHALLENGE_CONFIG)) {
        if (name.includes(key)) {
          config = value;
          break;
        }
      }
      
      // Verifica se já existe desafio ativo para este item
      const existingChallenges = loadChallenges();
      const hasActiveChallenge = existingChallenges.some(
        c => c.itemName.toLowerCase() === name && !c.isCompleted
      );
      
      if (!hasActiveChallenge) {
        const challenge: Challenge = {
          id: crypto.randomUUID(),
          itemName: itemsGroup[0].name,
          quantity: totalQuantity,
          daysLeft: minDaysLeft,
          recipeSuggestion: config.recipe,
          medal: config.medal,
          isCompleted: false,
        };
        
        return challenge;
      }
    }
  }
  
  return null;
};

// Salva novo desafio
export const createChallenge = (challenge: Challenge): void => {
  const challenges = loadChallenges();
  challenges.unshift(challenge);
  saveChallenges(challenges.slice(0, 20)); // Mantém últimos 20 desafios
};

// Completa um desafio e adiciona medalha
export const completeChallenge = (challengeId: string): string | null => {
  const challenges = loadChallenges();
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (!challenge || challenge.isCompleted) return null;
  
  challenge.isCompleted = true;
  saveChallenges(challenges);
  
  // Adiciona medalha
  const medals = loadMedals();
  if (!medals.includes(challenge.medal)) {
    medals.push(challenge.medal);
    saveMedals(medals);
  }
  
  return challenge.medal;
};

// Obtém desafios ativos
export const getActiveChallenges = (): Challenge[] => {
  return loadChallenges().filter(c => !c.isCompleted);
};

// Obtém todas as medalhas conquistadas
export const getEarnedMedals = (): string[] => {
  return loadMedals();
};
