import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(product, quantity);
    setQuantity(1);
    setIsAdding(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={product.stock === 0}
            className="w-16 px-2 py-2 border border-border rounded text-sm text-foreground bg-background"
          />
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="flex-1 gap-2"
          >
            <ShoppingCart size={16} />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
