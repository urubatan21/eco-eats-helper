import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Clock, CheckCircle, Plus, Zap, Bell, Trophy } from 'lucide-react';
import { Header } from '@/components/Header';
import { FoodItemCard } from '@/components/FoodItemCard';
import { ChallengeCard } from '@/components/ChallengeCard';
import { NotificationCard } from '@/components/NotificationCard';
import { StatsCard } from '@/components/StatsCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { FoodItem, Challenge, Notification } from '@/types';
import { loadFoodItems, saveFoodItems, updateMonthlyStats, loadNotifications } from '@/lib/storage';
import { getExpirationStatus } from '@/lib/expiration';
import { generateAllNotifications } from '@/lib/notifications';
import { detectChallenge, createChallenge, getActiveChallenges } from '@/lib/challenges';
import { useToast } from '@/hooks/use-toast';

export const HomePage = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadedItems = loadFoodItems().filter(item => item.status === 'em_estoque');
    setItems(loadedItems);
    
    // Gera notificações para itens próximos do vencimento
    const newNotifications = generateAllNotifications(loadedItems);
    if (newNotifications.length > 0) {
      setNotifications(loadNotifications());
    } else {
      setNotifications(loadNotifications().slice(0, 5));
    }
    
    // Detecta desafios
    const challenge = detectChallenge(loadedItems);
    if (challenge) {
      createChallenge(challenge);
      setActiveChallenge(challenge);
    } else {
      const activeChallenges = getActiveChallenges();
      if (activeChallenges.length > 0) {
        setActiveChallenge(activeChallenges[0]);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    
    // Atualiza o status do item para desperdiçado
    const allItems = loadFoodItems();
    const itemIndex = allItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      allItems[itemIndex].status = 'desperdicado';
      saveFoodItems(allItems);
      updateMonthlyStats('wasted');
    }
    
    setItems(updatedItems);
    toast({
      title: '🗑️ Item removido',
      description: 'O item foi marcado como desperdiçado.',
      variant: 'destructive',
    });
  };

  const handleConsume = (id: string) => {
    const allItems = loadFoodItems();
    const itemIndex = allItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      allItems[itemIndex].status = 'consumido';
      saveFoodItems(allItems);
      updateMonthlyStats('consumed');
    }
    
    setItems(items.filter(item => item.id !== id));
    toast({
      title: '🎉 Parabéns!',
      description: 'Item consumido! Você evitou desperdício.',
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

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="px-4 py-4 max-w-md mx-auto space-y-5">
        {/* Desafio Relâmpago */}
        {activeChallenge && (
          <ChallengeCard 
            challenge={activeChallenge} 
            onAccept={() => navigate('/recipes')}
          />
        )}

        {/* Notificações */}
        {notifications.length > 0 && !showNotifications && unreadNotifications > 0 && (
          <button
            onClick={() => setShowNotifications(true)}
            className="w-full p-4 rounded-xl bg-accent/10 border border-accent/30 flex items-center gap-3 hover:bg-accent/15 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">
                {unreadNotifications} alerta{unreadNotifications !== 1 ? 's' : ''} de validade
              </p>
              <p className="text-sm text-muted-foreground">Toque para ver</p>
            </div>
          </button>
        )}

        {showNotifications && notifications.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Alertas</h2>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-sm text-primary font-medium"
              >
                Ocultar
              </button>
            </div>
            {notifications.slice(0, 3).map(notification => (
              <NotificationCard 
                key={notification.id} 
                notification={notification}
                onAction={() => navigate('/recipes')}
              />
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <StatsCard icon={Package} label="Total" value={stats.total} variant="default" compact />
          <StatsCard icon={CheckCircle} label="OK" value={stats.fresh} variant="success" compact />
          <StatsCard icon={Clock} label="Urgente" value={stats.expiring} variant="warning" compact />
          <StatsCard icon={AlertTriangle} label="Vencido" value={stats.expired} variant="danger" compact />
        </div>

        {/* Items List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold font-display text-foreground">Meu Estoque</h2>
            <span className="text-sm text-muted-foreground">{items.length} itens</span>
          </div>
          
          {items.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Estoque vazio"
              description="Adicione itens ao seu estoque para começar a evitar desperdício"
              action={
                <Button onClick={() => navigate('/add')} className="eco-gradient shadow-eco">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar item
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {sortedItems.map(item => (
                <FoodItemCard 
                  key={item.id} 
                  item={item} 
                  onDelete={handleDelete}
                  onConsume={handleConsume}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
