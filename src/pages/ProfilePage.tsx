import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Trophy, TrendingUp, TrendingDown, Calendar, Package, Check, Trash2 } from 'lucide-react';
import { loadMonthlyStats, loadMedals } from '@/lib/storage';
import { MonthlyStats } from '@/types';

export const ProfilePage = () => {
  const [stats, setStats] = useState<MonthlyStats[]>([]);
  const [medals, setMedals] = useState<string[]>([]);

  useEffect(() => {
    setStats(loadMonthlyStats());
    setMedals(loadMedals());
  }, []);

  const currentMonth = stats[stats.length - 1];
  const previousMonth = stats[stats.length - 2];

  const getPerformance = () => {
    if (!currentMonth) return null;
    const wasteRate = currentMonth.totalAdded > 0 
      ? ((currentMonth.wasted / currentMonth.totalAdded) * 100).toFixed(0)
      : 0;
    return Number(wasteRate);
  };

  const performance = getPerformance();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header subtitle="Sua evolução" />
      
      <main className="px-4 py-4 max-w-md mx-auto space-y-5">
        {/* Performance do mês */}
        {currentMonth && (
          <div className="bg-card rounded-2xl p-5 border-2 border-border shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">
                {currentMonth.month} {currentMonth.year}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-xl bg-secondary">
                <Package className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xl font-bold text-foreground">{currentMonth.totalAdded}</p>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-success/10">
                <Check className="w-5 h-5 mx-auto mb-1 text-success" />
                <p className="text-xl font-bold text-success">{currentMonth.consumed}</p>
                <p className="text-xs text-muted-foreground">Consumidos</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-destructive/10">
                <Trash2 className="w-5 h-5 mx-auto mb-1 text-destructive" />
                <p className="text-xl font-bold text-destructive">{currentMonth.wasted}</p>
                <p className="text-xs text-muted-foreground">Desperdiçados</p>
              </div>
            </div>

            {performance !== null && (
              <div className={`p-3 rounded-xl flex items-center gap-3 ${
                performance <= 10 ? 'bg-success/10' : performance <= 30 ? 'bg-warning/10' : 'bg-destructive/10'
              }`}>
                {performance <= 10 ? (
                  <TrendingUp className="w-6 h-6 text-success" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <p className="font-bold text-foreground">
                    {performance <= 10 ? '🎉 Excelente!' : performance <= 30 ? '👍 Bom!' : '⚠️ Atenção!'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Taxa de desperdício: {performance}%
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medalhas */}
        <div className="bg-card rounded-2xl p-5 border-2 border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-foreground">Suas Medalhas</h2>
          </div>

          {medals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Complete desafios para ganhar medalhas! 🏆
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {medals.map((medal, index) => (
                <div 
                  key={index}
                  className="px-3 py-2 rounded-full bg-accent/10 border border-accent/30 text-sm font-medium medal-glow"
                >
                  {medal}
                </div>
              ))}
            </div>
          )}
        </div>

        {!currentMonth && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Adicione itens ao estoque para começar a acompanhar sua evolução
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
