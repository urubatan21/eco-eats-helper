import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

export const StatsCard = ({ icon: Icon, label, value, variant = 'default' }: StatsCardProps) => {
  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl border',
      variant === 'default' && 'bg-card border-border',
      variant === 'warning' && 'bg-warning/10 border-warning/20',
      variant === 'danger' && 'bg-destructive/10 border-destructive/20',
      variant === 'success' && 'bg-success/10 border-success/20'
    )}>
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center',
        variant === 'default' && 'bg-secondary',
        variant === 'warning' && 'bg-warning/20',
        variant === 'danger' && 'bg-destructive/20',
        variant === 'success' && 'bg-success/20'
      )}>
        <Icon className={cn(
          'w-5 h-5',
          variant === 'default' && 'text-foreground',
          variant === 'warning' && 'text-warning',
          variant === 'danger' && 'text-destructive',
          variant === 'success' && 'text-success'
        )} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};
