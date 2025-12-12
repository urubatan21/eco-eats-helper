import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/EmptyState';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { ShoppingItem } from '@/types';
import { loadShoppingList, saveShoppingList } from '@/lib/storage';
import { cn } from '@/lib/utils';

export const ShoppingPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    setItems(loadShoppingList());
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      quantity: 1,
      unit: 'un',
      checked: false,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveShoppingList(updatedItems);
    setNewItemName('');
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    saveShoppingList(updatedItems);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    saveShoppingList(updatedItems);
  };

  const clearChecked = () => {
    const updatedItems = items.filter(item => !item.checked);
    setItems(updatedItems);
    saveShoppingList(updatedItems);
  };

  const checkedCount = items.filter(item => item.checked).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Lista de Compras" subtitle={`${items.length} itens`} />
      
      <main className="px-4 py-4 max-w-md mx-auto space-y-4">
        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="flex gap-2">
          <Input
            placeholder="Adicionar item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="h-12 flex-1"
          />
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0">
            <Plus className="w-5 h-5" />
          </Button>
        </form>

        {/* Clear Checked Button */}
        {checkedCount > 0 && (
          <Button 
            variant="outline" 
            onClick={clearChecked}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar {checkedCount} {checkedCount === 1 ? 'item marcado' : 'itens marcados'}
          </Button>
        )}

        {/* Items List */}
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Lista vazia"
            description="Adicione itens à sua lista de compras"
            className="mt-8"
          />
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-4 bg-card rounded-xl border border-border transition-all duration-200',
                  item.checked && 'bg-muted/50 opacity-60'
                )}
              >
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="h-5 w-5"
                />
                <label
                  htmlFor={item.id}
                  className={cn(
                    'flex-1 text-foreground cursor-pointer',
                    item.checked && 'line-through text-muted-foreground'
                  )}
                >
                  {item.name}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
