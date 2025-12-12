import { Challenge } from '@/types';
import { Zap, Trophy, ChefHat } from 'lucide-react';
import { Button } from './ui/button';

interface ChallengeCardProps {
  challenge: Challenge;
  onAccept: () => void;
}

export const ChallengeCard = ({ challenge, onAccept }: ChallengeCardProps) => {
  return (
    <div className="challenge-card rounded-2xl p-4 animate-pop">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center animate-wiggle">
          <Zap className="w-6 h-6 text-accent" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground text-base">⚡ Desafio Relâmpago!</h3>
          </div>
          
          <p className="text-sm text-foreground mb-2">
            Você tem <span className="font-bold text-accent">{challenge.quantity} {challenge.itemName}</span> perto de vencer!
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Sugestão: <span className="font-medium text-foreground">{challenge.recipeSuggestion}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/10 mb-3">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Ganhe a medalha: <span className="text-accent">{challenge.medal}</span>
            </span>
          </div>
          
          <Button 
            onClick={onAccept}
            className="w-full eco-gradient shadow-eco font-bold"
          >
            Aceitar Desafio! 🎯
          </Button>
        </div>
      </div>
    </div>
  );
};
