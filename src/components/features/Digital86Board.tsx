import React, { useState } from 'react';
import { Ban, RefreshCcw } from 'lucide-react';
import { MENU_ITEMS } from '../../lib/constants';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const Digital86Board: React.FC = () => {
  const [unavailableItems, setUnavailableItems] = useState<string[]>(['2']); // Mock Initial ID

  const toggleAvailability = (id: string) => {
      if (unavailableItems.includes(id)) {
          setUnavailableItems(unavailableItems.filter(i => i !== id));
          toast.success('Item Restored to Menu');
      } else {
          setUnavailableItems([...unavailableItems, id]);
          toast.error('Item 86\'d (Removed from Menu)');
      }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-row gap-8">
      {/* Control Panel (Left) */}
      <div className="w-1/3 bg-[#1a1a1a] border-r border-white/10 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Ban className="text-red-500"/> 86 Management</h2>
          <div className="space-y-2">
              {MENU_ITEMS.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition">
                      <span className={unavailableItems.includes(item.id) ? 'text-zinc-500 line-through' : 'text-white'}>{item.name}</span>
                      <Button 
                        onClick={() => toggleAvailability(item.id)} 
                        className={`text-xs h-8 ${unavailableItems.includes(item.id) ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                      >
                          {unavailableItems.includes(item.id) ? <RefreshCcw size={14}/> : '86 Item'}
                      </Button>
                  </div>
              ))}
          </div>
      </div>

      {/* Live Display (Right) */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/10 z-0"></div>
        <h1 className="text-6xl font-black text-red-500 tracking-tighter uppercase flex items-center gap-4 animate-pulse mb-12 relative z-10">
            <Ban size={64} /> 86 BOARD
        </h1>
        
        <div className="grid grid-cols-1 gap-6 w-full max-w-2xl relative z-10">
            {unavailableItems.length === 0 ? (
                <div className="text-center text-zinc-500 text-xl font-mono border-2 border-dashed border-zinc-700 p-12 rounded-3xl">
                    ALL ITEMS AVAILABLE
                </div>
            ) : (
                MENU_ITEMS.filter(i => unavailableItems.includes(i.id)).map(item => (
                    <div key={item.id} className="bg-black/80 border-2 border-red-500 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_30px_rgba(239,68,68,0.3)] transform hover:scale-105 transition duration-300">
                        <span className="text-4xl font-bold text-white tracking-tight">{item.name}</span>
                        <span className="text-xl font-mono font-bold text-black bg-red-500 px-4 py-1 rounded shadow-lg transform rotate-2">SOLD OUT</span>
                    </div>
                ))
            )}
        </div>

        <div className="absolute bottom-8 text-red-500/50 text-xl font-mono uppercase tracking-widest">
            Kitchen Display System • Live Updates
        </div>
      </div>
    </div>
  );
};

export default Digital86Board;
