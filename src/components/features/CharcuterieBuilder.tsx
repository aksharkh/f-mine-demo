import React, { useState } from 'react';
import { ChefHat, Trash2, Plus, ShoppingBag } from 'lucide-react';
import { type CharcuterieItem } from '../../types';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const MOCK_ITEMS: CharcuterieItem[] = [
    { id: '1', name: 'Prosciutto Di Parma', type: 'Meat', price: 8, image: '' },
    { id: '2', name: 'Brie de Meaux', type: 'Cheese', price: 6, image: '' },
    { id: '3', name: 'Green Grapes', type: 'Fruit', price: 3, image: '' },
    { id: '4', name: 'Spicy Salami', type: 'Meat', price: 7, image: '' },
    { id: '5', name: 'Aged Cheddar', type: 'Cheese', price: 5, image: '' },
    { id: '6', name: 'Honeycomb', type: 'Accompaniment', price: 4, image: '' },
    { id: '7', name: 'Walnuts', type: 'Nut', price: 3, image: '' },
    { id: '8', name: 'Fig Jam', type: 'Accompaniment', price: 2, image: '' },
];

const CharcuterieBuilder: React.FC = () => {
  const [board, setBoard] = useState<CharcuterieItem[]>([]);
  const [items] = useState<CharcuterieItem[]>(MOCK_ITEMS);

  const addItem = (item: CharcuterieItem) => {
    if (board.length >= 8) {
        toast.error('Board is full! Remove an item first.');
        return;
    }
    setBoard([...board, { ...item, id: Math.random().toString() }]);
  };

  const removeItem = (index: number) => {
      const newBoard = [...board];
      newBoard.splice(index, 1);
      setBoard(newBoard);
  };

  const clearBoard = () => {
      setBoard([]);
      toast.success('Board Cleared');
  };

  const orderBoard = () => {
      toast.success(`Order Placed! Total: $${totalCost.toFixed(2)}`, { icon: '🧀' });
      setBoard([]);
  };

  const totalCost = board.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><ChefHat className="text-orange-400"/> Custom Charcuterie Board</h2>
         <div className="flex items-center gap-4">
            <span className="text-zinc-500 text-sm">{board.length} / 8 Items</span>
            <div className="text-2xl font-black text-green-400 bg-white/5 px-4 py-1 rounded-lg border border-white/10">${totalCost.toFixed(2)}</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
          {/* Item Selection */}
          <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 overflow-auto flex flex-col">
              <h3 className="text-zinc-400 mb-4 font-bold uppercase text-xs tracking-wider border-b border-white/10 pb-2">Select Ingredients</h3>
              <div className="grid grid-cols-2 gap-3 pb-4">
                  {items.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => addItem(item)}
                        className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-orange-500/50 cursor-pointer transition hover:bg-white/10 group relative"
                      >
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><Plus size={14} className="text-green-400"/></div>
                          <div className="text-white font-medium text-sm pr-4">{item.name}</div>
                          <div className="flex justify-between items-center mt-2">
                              <span className="text-[10px] text-zinc-500 uppercase bg-black/20 px-1.5 py-0.5 rounded">{item.type}</span>
                              <span className="font-bold text-orange-400 text-sm">${item.price}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Board Visualization area (Drop Zone) */}
          <div className="lg:col-span-2 bg-[#222] rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Wood Texture Background Overlay */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")'}}></div>
                
                {board.length === 0 && (
                    <div className="text-center text-zinc-500 pointer-events-none relative z-10 animate-pulse">
                        <ChefHat size={64} className="mx-auto mb-4 opacity-50"/>
                        <p className="text-xl font-light">Select items on the left to build your board</p>
                    </div>
                )}
                
                {/* The Board */}
                <div className={`relative w-[500px] h-[500px] bg-[#3d2b1f] rounded-full shadow-2xl flex flex-wrap content-center justify-center p-14 gap-6 transition-all duration-500 ${board.length > 0 ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}`}>
                    <div className="absolute inset-0 rounded-full border-[20px] border-[#2a1d15] opacity-50 shadow-inner pointer-events-none"></div>
                    
                    {board.map((item, index) => (
                        <div key={index} className="relative group animate-bounce-in">
                             <div className="w-20 h-20 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center text-black font-bold text-xs transform group-hover:scale-110 transition cursor-default text-center p-2 border-4 border-zinc-100 z-10 relative">
                                {item.name}
                             </div>
                             <div className="absolute -bottom-2 w-full text-center text-[10px] font-bold text-white/80 bg-black/50 rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition duration-200 z-20 pointer-events-none">
                                 ${item.price}
                             </div>
                             <button 
                                onClick={() => removeItem(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition z-30 hover:bg-red-600 shadow-md"
                             >
                                 <Trash2 size={12} />
                             </button>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 right-6 flex gap-4 z-20">
                    <Button onClick={clearBoard} variant="outline" disabled={board.length === 0} className="bg-black/50 border-white/20 hover:bg-black/70 backdrop-blur-md">Clear Board</Button>
                    <Button onClick={orderBoard} disabled={board.length === 0} className="px-8 py-3 shadow-xl bg-green-600 hover:bg-green-500 border-none font-bold text-lg"><ShoppingBag size={18} className="mr-2"/> Order Now</Button>
                </div>
          </div>
      </div>
    </div>
  );
};

export default CharcuterieBuilder;
