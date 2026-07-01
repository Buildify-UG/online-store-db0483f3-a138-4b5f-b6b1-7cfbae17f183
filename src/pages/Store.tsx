import { useState } from 'react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

export default function Store() {
  const navigate = useNavigate();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  const handleAddToCart = async (product: Product, quantity: number) => {
    // For now, just increment cart count
    // In a real app, this would add to database
    setCartCount(prev => prev + quantity);
    
    // Show feedback
    const event = new CustomEvent('cartUpdated', { detail: { product, quantity } });
    window.dispatchEvent(event);
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Store</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/cart')}
            className="gap-2"
          >
            <ShoppingCart size={20} />
            Cart ({cartCount})
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-6">
            {selectedCategory ? 'Filtered Products' : 'All Products'}
          </h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
