import { Notification } from '@/types';
import { DollarSign, ChefHat, Heart, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
  notification: Notification;
  onAction: () => void;
}

export const NotificationCard = ({ notification, onAction }: NotificationCardProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'financial':
        return <DollarSign className="w-5 h-5" />;
      case 'chef':
        return <ChefHat className="w-5 h-5" />;
      case 'personification':
        return <Heart className="w-5 h-5" />;
    }
  };

  const getIconBg = () => {
    switch (notification.type) {
      case 'financial':
        return 'bg-destructive/10 text-destructive';
      case 'chef':
        return 'bg-primary/10 text-primary';
      case 'personification':
        return 'bg-accent/10 text-accent';
    }
  };

  return (
    <button
      onClick={onAction}
      className={cn(
        'w-full p-4 rounded-xl bg-card border border-border shadow-card text-left transition-all hover:border-primary/30 hover:shadow-md animate-fade-in',
        !notification.read && 'border-l-4 border-l-primary'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', getIconBg())}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-sm mb-0.5 truncate">
            {notification.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.body}
          </p>
          
          <div className="flex items-center gap-1 mt-2 text-primary text-sm font-semibold">
            {notification.cta}
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </button>
  );
};
