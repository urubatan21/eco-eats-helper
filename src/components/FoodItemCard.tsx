import { FoodItem } from '@/types';
import { getExpirationStatus, getDaysUntilExpiration, getStatusLabel, getStatusColor, estimatePrice } from '@/lib/expiration';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, AlertTriangle, Clock, CheckCircle, Check, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FoodItemCardProps {
  item: FoodItem;
  onDelete: (id: string) => void;
  onConsume?: (id: string) => void;
}

export const FoodItemCard = ({ item, onDelete, onConsume }: FoodItemCardProps) => {
  const status = getExpirationStatus(item.expirationDate);
  const daysLeft = getDaysUntilExpiration(item.expirationDate);
  const statusLabel = getStatusLabel(status);
  const statusClass = getStatusColor(status);
  const price = item.estimatedPrice || estimatePrice(item.name);

  const StatusIcon = status === 'expired' ? AlertTriangle : status === 'expiring' ? Clock : CheckCircle;

  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      'Fruta': '🍎',
      'Legume': '🥕',
      'Verdura': '🥬',
      'Laticínio': '🥛',
      'Carne': '🥩',
      'Industrializado': '📦',
      'Grão': '🌾',
      'Bebida': '🥤',
      'Congelado': '🧊',
      'Tempero': '🧂',
      'Outro': '🍽️',
    };
    return emojis[category] || '🍽️';
  };

  return (
    <div className={cn(
      'bg-card rounded-2xl p-4 shadow-card border-2 animate-fade-in transition-all duration-300',
      status === 'expired' && 'border-destructive/40 bg-destructive/5',
      status === 'expiring' && 'border-warning/40 bg-warning/5',
      status === 'fresh' && 'border-border hover:border-primary/30'
    )}>
      <div className="flex items-start gap-3">
        {/* Emoji da categoria */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0',
          status === 'expired' && 'bg-destructive/10',
          status === 'expiring' && 'bg-warning/10',
          status === 'fresh' && 'bg-primary/10',
        )}>
          {getCategoryEmoji(item.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-foreground truncate text-base">{item.name}</h3>
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border shrink-0',
              statusClass
            )}>
              <StatusIcon className="w-3 h-3" />
              {statusLabel}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="font-medium">{item.quantity} {item.unit}</span>
            <span className="text-muted-foreground/30">•</span>
            <span>{item.category}</span>
            {item.isNatural && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <span className="text-primary text-xs">🌿 Natural</span>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-sm font-bold',
                status === 'expired' && 'text-destructive',
                status === 'expiring' && 'text-warning',
                status === 'fresh' && 'text-muted-foreground'
              )}>
                {status === 'expired' 
                  ? `Venceu há ${Math.abs(daysLeft)} dia${Math.abs(daysLeft) !== 1 ? 's' : ''}`
                  : daysLeft === 0 
                    ? '⚡ Vence hoje!'
                    : daysLeft === 1
                      ? '⚡ Vence amanhã!'
                      : `Vence em ${daysLeft} dias`
                }
              </span>
              {status !== 'fresh' && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ~R$ {price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Ações */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
        {onConsume && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConsume(item.id)}
            className="flex-1 h-9 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            <Check className="w-4 h-4 mr-1" />
            Consumir
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Descartar
        </Button>
      </div>
    </div>
  );
};
