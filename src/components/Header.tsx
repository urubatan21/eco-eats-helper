import { Leaf } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur-lg z-40 safe-top border-b border-border/50">
      <div className="flex items-center gap-3 px-4 py-4 max-w-md mx-auto">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Leaf className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
};
