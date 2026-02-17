import React, { useState } from 'react';
import { Apple, Activity } from 'lucide-react';
import { MENU_ITEMS } from '../../lib/constants';
import { type MenuItem } from '../../types';

const NutritionalCalc: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Apple /> Nutritional Calculator</h2>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Item Selector */}
           <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-4 overflow-auto">
                <input type="text" placeholder="Search..." className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white mb-4" />
                <div className="space-y-2">
                    {MENU_ITEMS.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedItem(item)}
                            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition ${selectedItem?.id === item.id ? 'bg-primary text-white' : 'hover:bg-white/5 text-zinc-300'}`}
                        >
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                            <span className="font-medium">{item.name}</span>
                        </div>
                    ))}
                </div>
           </div>

           {/* Details Panel */}
           <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl border border-white/10 p-8 flex flex-col items-center justify-center">
                {selectedItem ? (
                    <div className="w-full max-w-md">
                        <img src={selectedItem.image} alt={selectedItem.name} className="w-32 h-32 rounded-full mx-auto object-cover mb-6 border-4 border-white/10" />
                        <h2 className="text-3xl font-bold text-center text-white mb-2">{selectedItem.name}</h2>
                        <div className="text-center text-zinc-400 mb-8">{selectedItem.calories} Calories</div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-black/20 p-4 rounded-xl text-center border border-white/5">
                                <div className="text-sm text-zinc-500 mb-1">Protein</div>
                                <div className="text-xl font-bold text-white">{selectedItem.macros?.protein || '20g'}</div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl text-center border border-white/5">
                                <div className="text-sm text-zinc-500 mb-1">Carbs</div>
                                <div className="text-xl font-bold text-white">{selectedItem.macros?.carbs || '45g'}</div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl text-center border border-white/5">
                                <div className="text-sm text-zinc-500 mb-1">Fat</div>
                                <div className="text-xl font-bold text-white">{selectedItem.macros?.fat || '15g'}</div>
                            </div>
                        </div>

                         <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2"><Activity size={14}/> Breakdown</h4>
                            <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden flex">
                                <div className="bg-red-500 h-full" style={{ width: '25%' }} title="Fat"></div>
                                <div className="bg-blue-500 h-full" style={{ width: '45%' }} title="Carbs"></div>
                                <div className="bg-green-500 h-full" style={{ width: '30%' }} title="Protein"></div>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-500 mt-2">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Fat</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Carbs</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Protein</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-zinc-500 text-center">
                        <Apple size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Select an item to view nutritional facts</p>
                    </div>
                )}
           </div>
      </div>
    </div>
  );
};

export default NutritionalCalc;
