import React, { useState } from 'react';
import { type MenuItem, type CartItem } from '../../types';
import Button from '../ui/Button';

interface WaiterPOSProps {
  menuItems: MenuItem[];
  onPlaceOrder: (cart: any[], tableId: string) => void;
}

const WaiterPOS: React.FC<WaiterPOSProps> = ({ menuItems, onPlaceOrder }) => {
  const [selectedTable, setSelectedTable] = useState('1');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    // Simplified add for POS (quantity 1, no options)
    const cartItem: CartItem = { ...item, quantity: 1 };
    setCart(prev => [...prev, cartItem]);
  };

  const submit = () => { 
    onPlaceOrder(cart, selectedTable); 
    setCart([]); 
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-[80vh]">
      <div className="col-span-2 bg-[#161616] rounded-2xl p-6 overflow-y-auto">
        <h3 className="text-xl font-serif mb-4">Menu Items</h3>
        <div className="grid grid-cols-4 gap-4">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => addToCart(item)} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 text-left">
              <div className="font-bold text-sm mb-1">{item.name}</div>
              <div className="text-white/40 text-xs">${item.price}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col">
        <h3 className="text-xl font-serif mb-4">Current Order</h3>
        <div className="mb-4">
          <label className="text-xs uppercase text-white/40 block mb-2">Table Number</label>
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4,5,6,7,8].map(n => (
              <button 
                key={n} 
                onClick={() => setSelectedTable(n.toString())} 
                className={`py-2 rounded border ${selectedTable === n.toString() ? 'bg-[#d94e28] border-[#d94e28]' : 'bg-transparent border-white/10'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm border-b border-white/5 py-2">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span>${cart.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
          </div>
          <Button onClick={submit} className="w-full">Send to Kitchen</Button>
        </div>
      </div>
    </div>
  );
};

export default WaiterPOS;
