import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemove = (productId: string) => {
    setCartItems(items => items.filter(item => item.product.id !== productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
    } else {
      setCartItems(items =>
        items.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/')}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.product.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                    <p className="text-muted-foreground">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 px-2 py-1 border border-border rounded text-sm text-foreground bg-background"
                      />
                      <span className="text-sm text-muted-foreground">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.product.id)}
                  >
                    <Trash2 size={20} className="text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
