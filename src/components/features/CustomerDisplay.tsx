import React, { useState, useEffect } from 'react';
import { Monitor, CreditCard } from 'lucide-react';
import { type CartItem } from '../../types';
import Button from '../ui/Button'; // Assuming Button component exists

const DEMO_CART: CartItem[] = [
    { id: '1', name: 'Wagyu Burger', price: 24, quantity: 1, category: 'main', station: 'kitchen', description: '', ingredients: '', calories: '', tags: [], dietary: [], options: [], image: '' },
    { id: '2', name: 'Truffle Fries', price: 12, quantity: 2, category: 'starter', station: 'kitchen', description: '', ingredients: '', calories: '', tags: [], dietary: [], options: [], image: '' },
    { id: '3', name: 'Coke Zero', price: 4, quantity: 2, category: 'drinks', station: 'bar', description: '', ingredients: '', calories: '', tags: [], dietary: [], options: [], image: '' },
];

const CustomerDisplay: React.FC = () => {
  const [cart] = useState<CartItem[]>(DEMO_CART);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'paying' | 'success'>('idle');

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = total * 0.08;

  useEffect(() => {
      if (status === 'paying') {
          setTimeout(() => setStatus('success'), 3000);
      }
      if (status === 'success') {
          setTimeout(() => setStatus('idle'), 5000);
      }
  }, [status]);

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-black p-10">
      <div className="w-full max-w-5xl h-full grid grid-cols-2 gap-0 border-8 border-zinc-800 rounded-3xl overflow-hidden bg-white relative">
            
            {/* Payment Overlay */}
            {status === 'paying' && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white">
                    <div className="animate-spin mb-4"><CreditCard size={64}/></div>
                    <h2 className="text-2xl font-bold">Processing Payment...</h2>
                    <p className="text-zinc-400">Please tap your card</p>
                </div>
            )}
            {status === 'success' && (
                <div className="absolute inset-0 bg-green-500 z-50 flex flex-col items-center justify-center text-white">
                     <h2 className="text-4xl font-black mb-2">Payment Successful!</h2>
                     <p className="text-lg opacity-90">Enjoy your meal.</p>
                </div>
            )}

            {/* Left: Branding / Promo */}
            <div className="bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000")' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white p-8">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Monitor size={48} className="text-black"/>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-2">Gourmet OS</h1>
                    <p className="text-xl opacity-90 mb-8">Taste the future.</p>
                    
                    {status === 'idle' && (
                        <Button onClick={() => setStatus('paying')} className="bg-white text-black hover:bg-zinc-200 text-lg px-8 py-4 w-full font-bold">
                            Simulate Payment
                        </Button>
                    )}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="flex flex-col h-full bg-zinc-50">
                <div className="p-8 flex-1 overflow-auto">
                    <h2 className="text-2xl font-bold text-zinc-800 mb-6 border-b pb-4">Your Order</h2>
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-lg text-zinc-900">{item.quantity}x {item.name}</div>
                                    <div className="text-zinc-500 text-sm">Regular Size</div>
                                </div>
                                <div className="font-bold text-zinc-900 text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-zinc-900 text-white">
                    <div className="flex justify-between mb-2 text-zinc-400">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-6 text-zinc-400">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/20 pt-6">
                        <span className="text-2xl font-light">Total</span>
                        <span className="text-5xl font-bold text-green-400">${(total + tax).toFixed(2)}</span>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
