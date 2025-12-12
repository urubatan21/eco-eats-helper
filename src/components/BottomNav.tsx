import { Home, Plus, ChefHat, ShoppingCart, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Estoque' },
  { path: '/add', icon: Plus, label: 'Adicionar' },
  { path: '/recipes', icon: ChefHat, label: 'Cozinhar' },
  { path: '/shopping', icon: ShoppingCart, label: 'Compras' },
  { path: '/profile', icon: BarChart3, label: 'Evolução' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-xl border-t border-border/50 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]',
                isActive
                  ? 'text-primary bg-primary/10 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'animate-bounce-soft')} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
