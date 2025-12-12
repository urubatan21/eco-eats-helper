import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Clock, CheckCircle, Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { FoodItemCard } from '@/components/FoodItemCard';
import { StatsCard } from '@/components/StatsCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { FoodItem } from '@/types';
import { loadFoodItems, saveFoodItems } from '@/lib/storage';
import { getExpirationStatus } from '@/lib/expiration';
import { useToast } from '@/hooks/use-toast';

export const HomePage = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setItems(loadFoodItems());
  }, []);

  const handleDelete = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    saveFoodItems(updatedItems);
    toast({
      title: 'Item removido',
      description: 'O item foi removido do seu estoque.',
    });
  };

  const stats = {
    total: items.length,
    expired: items.filter(item => getExpirationStatus(item.expirationDate) === 'expired').length,
    expiring: items.filter(item => getExpirationStatus(item.expirationDate) === 'expiring').length,
    fresh: items.filter(item => getExpirationStatus(item.expirationDate) === 'fresh').length,
  };

  // Sort items by expiration date (most urgent first)
  const sortedItems = [...items].sort((a, b) => {
    const statusOrder = { expired: 0, expiring: 1, fresh: 2 };
    const statusA = getExpirationStatus(a.expirationDate);
    const statusB = getExpirationStatus(b.expirationDate);
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Zero Desperdício" subtitle="Controle seu estoque" />
      
      <main className="px-4 py-4 max-w-md mx-auto space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard icon={Package} label="Total" value={stats.total} variant="default" />
          <StatsCard icon={CheckCircle} label="OK" value={stats.fresh} variant="success" />
          <StatsCard icon={Clock} label="Vence em breve" value={stats.expiring} variant="warning" />
          <StatsCard icon={AlertTriangle} label="Vencidos" value={stats.expired} variant="danger" />
        </div>

        {/* Items List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Meu Estoque</h2>
            <span className="text-sm text-muted-foreground">{items.length} itens</span>
          </div>
          
          {items.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Estoque vazio"
              description="Adicione itens ao seu estoque para começar a controlar a validade"
              action={
                <Button onClick={() => navigate('/add')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar item
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {sortedItems.map(item => (
                <FoodItemCard key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
