import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodItem, FOOD_CATEGORIES, UNITS } from '@/types';
import { loadFoodItems, saveFoodItems } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save } from 'lucide-react';

export const AddItemPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: '1',
    unit: 'un',
    category: 'Outros',
    expirationDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.expirationDate) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome e a data de validade.',
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
      expirationDate: new Date(formData.expirationDate),
      addedAt: new Date(),
    };

    const items = loadFoodItems();
    items.push(newItem);
    saveFoodItems(items);

    toast({
      title: 'Item adicionado!',
      description: `${newItem.name} foi adicionado ao estoque.`,
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Adicionar Item" subtitle="Cadastre um novo produto" />
      
      <main className="px-4 py-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OCR Button - Future implementation */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-24 border-dashed border-2 flex flex-col gap-2"
            onClick={() => {
              toast({
                title: 'Em breve!',
                description: 'Escaneamento de rótulos será implementado em breve.',
              });
            }}
          >
            <Camera className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Escanear rótulo (OCR)</span>
          </Button>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do produto *</Label>
            <Input
              id="name"
              placeholder="Ex: Leite integral"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
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
              <Label htmlFor="unit">Unidade</Label>
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

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOOD_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration">Data de validade *</Label>
            <Input
              id="expiration"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Salvar item
          </Button>
        </form>
      </main>
    </div>
  );
};
