import { Apple } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const Header = ({ title = "ECOBUDDY", subtitle, showLogo = true }: HeaderProps) => {
  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-40 safe-top border-b border-border/50">
      <div className="flex items-center gap-3 px-4 py-4 max-w-md mx-auto">
        {showLogo && (
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl eco-gradient shadow-eco">
            <Apple className="w-6 h-6 text-primary-foreground" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold font-display text-gradient tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
          ) : (
            <p className="text-xs text-muted-foreground font-medium">
              Seu amigo 0 desperdício
            </p>
          )}
        </div>
      </div>
    </header>
  );
};
