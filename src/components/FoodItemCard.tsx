import { FoodItem } from '@/types';
import { getExpirationStatus, getDaysUntilExpiration, getStatusLabel, getStatusColor } from '@/lib/expiration';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FoodItemCardProps {
  item: FoodItem;
  onDelete: (id: string) => void;
}

export const FoodItemCard = ({ item, onDelete }: FoodItemCardProps) => {
  const status = getExpirationStatus(item.expirationDate);
  const daysLeft = getDaysUntilExpiration(item.expirationDate);
  const statusLabel = getStatusLabel(status);
  const statusClass = getStatusColor(status);

  const StatusIcon = status === 'expired' ? AlertTriangle : status === 'expiring' ? Clock : CheckCircle;

  return (
    <div className={cn(
      'bg-card rounded-xl p-4 shadow-sm border animate-fade-in',
      status === 'expired' && 'border-destructive/30 bg-destructive/5',
      status === 'expiring' && 'border-warning/30 bg-warning/5',
      status === 'fresh' && 'border-border'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
              statusClass
            )}>
              <StatusIcon className="w-3 h-3" />
              {statusLabel}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{item.quantity} {item.unit}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{item.category}</span>
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className={cn(
              'font-medium',
              status === 'expired' && 'text-destructive',
              status === 'expiring' && 'text-warning',
              status === 'fresh' && 'text-muted-foreground'
            )}>
              {status === 'expired' 
                ? `Vencido há ${Math.abs(daysLeft)} dia${Math.abs(daysLeft) !== 1 ? 's' : ''}`
                : daysLeft === 0 
                  ? 'Vence hoje!'
                  : `Vence em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`
              }
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-muted-foreground">
              {format(item.expirationDate, "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
