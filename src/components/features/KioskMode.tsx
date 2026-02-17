import React, { useState } from 'react';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import { MENU_ITEMS } from '../../lib/constants';
import { store } from '../../lib/store';
import Button from '../ui/Button';
import { type CartItem } from '../../types';
import { toast } from 'react-hot-toast';

const KioskMode: React.FC = () => {
  const [view, setView] = useState<'menu' | 'cart' | 'payment'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: any) => {
      const existing = cart.find(i => i.id === item.id);
      if (existing) {
          setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
          setCart([...cart, { ...item, quantity: 1 }]);
      }
      toast.success('Added to Order');
  };

  const removeFromCart = (id: string) => {
      setCart(cart.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
      const item = cart.find(i => i.id === id);
      if (item) {
          if (item.quantity + delta <= 0) {
              removeFromCart(id);
          } else {
              setCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i));
          }
      }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = () => {
      store.addKitchenOrder({
          id: Math.random().toString(36).substr(2, 5),
          userId: 'kiosk-user',
          tableId: 'Kiosk 1',
          items: cart,
          status: 'pending',
          createdAt: new Date(),
          total: total,
          isPriority: false 
      });
      toast.success('Order Placed Successfully! Please take your receipt.');
      setCart([]);
      setView('menu');
  };

  return (
    <div className="fixed inset-0 bg-zinc-900 text-white z-[100] flex flex-col">
      {/* Kiosk Header */}
      <div className="p-8 bg-zinc-800 border-b border-white/10 flex justify-between items-center shadow-2xl">
        <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">SELF-ORDER</h1>
            <p className="text-zinc-400">Tap to browse our menu and order</p>
        </div>
        <div className="flex gap-4">
             {view !== 'menu' && (
                <Button variant="outline" onClick={() => setView('menu')} className="text-lg px-6 py-4 rounded-xl border-2">
                    <ChevronLeft size={24} className="mr-2" /> Back
                </Button>
            )}
             <div className="bg-primary hover:bg-primary/90 text-black px-8 py-4 rounded-xl text-xl font-bold cursor-pointer transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]" onClick={() => setView('menu')}>
               Start Over
             </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 bg-[#0a0a0a]">
        {view === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {MENU_ITEMS.map((item) => (
              <div key={item.id} className="bg-zinc-900 rounded-3xl overflow-hidden shadow-xl border border-white/5 active:scale-[0.98] transition-all cursor-pointer group hover:border-primary/50" onClick={() => addToCart(item)}>
                <div className="h-64 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="text-3xl font-bold text-white">${item.price}</span>
                        <Button className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-white text-black hover:bg-zinc-200"><Plus size={24}/></Button>
                    </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">{item.name}</h3>
                  <p className="text-zinc-400 line-clamp-2 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Your Selection</h2>
            <div className="bg-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
                {cart.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 text-2xl">Your cart is empty.</div>
                ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex justify-between items-center border-b border-white/10 pb-6 last:border-0">
                        <div className="flex-1">
                          <div className="text-2xl font-bold text-white mb-2">{item.name}</div>
                          <div className="text-primary text-xl font-bold">${item.price * item.quantity}</div>
                        </div>
                        <div className="flex items-center gap-6 bg-black/40 rounded-full px-4 py-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Minus size={20}/></button>
                            <span className="text-2xl font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Plus size={20}/></button>
                        </div>
                      </div>
                    ))
                )}
                
                {cart.length > 0 && (
                    <div className="mt-8 pt-8 border-t-2 border-dashed border-white/20">
                      <div className="flex justify-between text-3xl font-black mb-8">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <Button onClick={placeOrder} className="w-full text-2xl py-8 rounded-2xl bg-green-500 hover:bg-green-600 text-black font-black shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-pulse">
                          PAY & ORDER NOW
                      </Button>
                    </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Kiosk Footer */}
      {view === 'menu' && cart.length > 0 && (
          <div className="p-6 bg-zinc-800 border-t border-white/10 flex justify-center">
            <Button 
                variant="primary" 
                className="text-2xl px-16 py-8 rounded-full shadow-lg"
                onClick={() => setView('cart')}
            >
                View Order • {cart.reduce((a,b)=>a+b.quantity,0)} Items • ${total.toFixed(2)}
            </Button>
          </div>
      )}
    </div>
  );
};

export default KioskMode;
