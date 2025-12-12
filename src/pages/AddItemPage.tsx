import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodItem, FoodCategory, FOOD_CATEGORIES, UNITS } from '@/types';
import { loadFoodItems, saveFoodItems, updateMonthlyStats } from '@/lib/storage';
import { isNaturalCategory, estimateExpirationDate, estimatePrice } from '@/lib/expiration';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, Sparkles, Zap } from 'lucide-react';
import { format } from 'date-fns';

export const AddItemPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: '1',
    unit: 'un',
    category: 'Outro' as FoodCategory,
    expirationDate: '',
  });

  const [isNatural, setIsNatural] = useState(false);
  const [estimatedDate, setEstimatedDate] = useState<string>('');

  // Atualiza quando a categoria muda
  const handleCategoryChange = (category: FoodCategory) => {
    const natural = isNaturalCategory(category);
    setIsNatural(natural);
    setFormData({ ...formData, category });
    
    // Se for natural e já tiver nome, estima a validade
    if (natural && formData.name) {
      const estimated = estimateExpirationDate(formData.name, category);
      setEstimatedDate(format(estimated, 'yyyy-MM-dd'));
    } else {
      setEstimatedDate('');
    }
  };

  // Atualiza estimativa quando o nome muda
  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    
    if (isNatural && name) {
      const estimated = estimateExpirationDate(name, formData.category);
      setEstimatedDate(format(estimated, 'yyyy-MM-dd'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalExpirationDate = isNatural ? estimatedDate : formData.expirationDate;
    
    if (!formData.name.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Digite o nome do produto.',
        variant: 'destructive',
      });
      return;
    }

    if (!finalExpirationDate) {
      toast({
        title: 'Validade obrigatória',
        description: isNatural 
          ? 'Selecione uma categoria para estimar a validade.' 
          : 'Informe a data de validade do produto.',
        variant: 'destructive',
      });
      return;
    }

    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      quantity: parseFloat(formData.quantity) || 1,
      unit: formData.unit,
      category: formData.category,
      expirationDate: new Date(finalExpirationDate),
      status: 'em_estoque',
      addedAt: new Date(),
      estimatedPrice: estimatePrice(formData.name),
      isNatural,
    };

    const items = loadFoodItems();
    items.push(newItem);
    saveFoodItems(items);
    updateMonthlyStats('added');

    toast({
      title: '✅ Item adicionado!',
      description: `${newItem.name} foi adicionado ao estoque.`,
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header subtitle="Cadastrar produto" />
      
      <main className="px-4 py-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Opções de cadastro */}
          <div className="grid grid-cols-2 gap-3">
            {/* Botão OCR/Foto */}
            <Button
              type="button"
              variant="outline"
              className="h-28 border-dashed border-2 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => {
                toast({
                  title: '📷 Em breve!',
                  description: 'Cadastro por foto com IA Vision será implementado em breve.',
                });
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-foreground block">Tirar Foto</span>
                <span className="text-xs text-muted-foreground">IA Vision</span>
              </div>
            </Button>

            {/* Botão Cadastro Rápido */}
            <div className="h-28 rounded-xl bg-primary/5 border-2 border-primary flex flex-col gap-2 items-center justify-center">
              <div className="w-12 h-12 rounded-xl eco-gradient flex items-center justify-center shadow-eco">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-primary block">Manual</span>
                <span className="text-xs text-muted-foreground">Rápido</span>
              </div>
            </div>
          </div>

          {/* Nome do produto */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Nome do produto *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Banana, Leite integral, Macarrão..."
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Categoria
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleCategoryChange(value as FoodCategory)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOOD_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                    {isNaturalCategory(cat) && ' 🌿'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isNatural && (
              <p className="text-xs text-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Produto natural - validade será estimada automaticamente
              </p>
            )}
          </div>

          {/* Quantidade e Unidade */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-semibold">
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-semibold">
                Unidade
              </Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data de validade */}
          <div className="space-y-2">
            {isNatural ? (
              <>
                <Label className="text-sm font-semibold flex items-center gap-2">
                  Validade estimada
                  <span className="text-xs font-normal text-muted-foreground">(automática)</span>
                </Label>
                <div className="h-12 px-4 rounded-lg bg-secondary flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    {estimatedDate 
                      ? format(new Date(estimatedDate), 'dd/MM/yyyy')
                      : 'Será calculada automaticamente'
                    }
                  </span>
                  {estimatedDate && (
                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                      Estimada
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Baseada em boas práticas de armazenamento
                </p>
              </>
            ) : (
              <>
                <Label htmlFor="expiration" className="text-sm font-semibold">
                  Data de validade *
                  <span className="text-xs font-normal text-muted-foreground ml-1">(do rótulo)</span>
                </Label>
                <Input
                  id="expiration"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="h-12"
                />
              </>
            )}
          </div>

          <Button type="submit" className="w-full h-14 text-base font-bold eco-gradient shadow-eco" size="lg">
            <Save className="w-5 h-5 mr-2" />
            Salvar no Estoque
          </Button>
        </form>
      </main>
    </div>
  );
};
