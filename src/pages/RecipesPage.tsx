import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { ChefHat, Sparkles, Loader2, Package } from 'lucide-react';
import { FoodItem } from '@/types';
import { loadFoodItems } from '@/lib/storage';
import { getExpirationStatus } from '@/lib/expiration';
import { cn } from '@/lib/utils';

export const RecipesPage = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const allItems = loadFoodItems();
    // Show only non-expired items, prioritizing expiring ones
    const validItems = allItems
      .filter(item => getExpirationStatus(item.expirationDate) !== 'expired')
      .sort((a, b) => {
        const statusA = getExpirationStatus(a.expirationDate);
        const statusB = getExpirationStatus(b.expirationDate);
        if (statusA === 'expiring' && statusB !== 'expiring') return -1;
        if (statusA !== 'expiring' && statusB === 'expiring') return 1;
        return 0;
      });
    setItems(validItems);
  }, []);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleGenerateRecipe = async () => {
    if (selectedItems.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate AI recipe generation - Replace with actual n8n/API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedIngredients = items
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.name);
    
    // Mock recipe response
    setRecipe(`
## Receita Sugerida: Salada Nutritiva

### Ingredientes:
${selectedIngredients.map(ing => `- ${ing}`).join('\n')}
- Azeite de oliva
- Sal e pimenta a gosto

### Modo de Preparo:
1. Lave bem todos os ingredientes
2. Corte em pedaços médios
3. Misture tudo em uma tigela grande
4. Tempere com azeite, sal e pimenta
5. Sirva imediatamente

### Dica:
Esta receita ajuda a evitar o desperdício dos ingredientes que estão próximos do vencimento!

⏱️ Tempo de preparo: 15 minutos
🍽️ Serve: 2 pessoas
    `);
    
    setIsLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="Receitas" subtitle="Sugestões com IA" />
        <EmptyState
          icon={Package}
          title="Sem ingredientes"
          description="Adicione itens ao seu estoque para receber sugestões de receitas"
          className="mt-12"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Receitas" subtitle="Sugestões com IA" />
      
      <main className="px-4 py-4 max-w-md mx-auto space-y-5">
        {/* Ingredient Selection */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Selecione os ingredientes
          </h2>
          <div className="flex flex-wrap gap-2">
            {items.map(item => {
              const isExpiring = getExpirationStatus(item.expirationDate) === 'expiring';
              const isSelected = selectedItems.includes(item.id);
              
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : isExpiring
                        ? 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20'
                        : 'bg-card text-foreground border-border hover:bg-secondary'
                  )}
                >
                  {item.name}
                  {isExpiring && !isSelected && ' ⚠️'}
                </button>
              );
            })}
          </div>
        </section>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateRecipe}
          disabled={selectedItems.length === 0 || isLoading}
          className="w-full h-12"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando receita...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar receita com IA
            </>
          )}
        </Button>

        {/* Recipe Result */}
        {recipe && (
          <section className="animate-fade-in">
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Sua Receita</h3>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {recipe}
                </pre>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
