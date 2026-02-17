import React, { useState } from 'react';
import { Wine as WineIcon, ThumbsUp, Info } from 'lucide-react';
import { type Wine } from '../../types';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const MOCK_WINES: Wine[] = [
    { id: '1', name: 'Barolo DOCG', type: 'Red', region: 'Piedmont, Italy', price: 85, tags: ['Bold', 'Tannic'], pairings: ['Steak', 'Truffle'], image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=200' },
    { id: '2', name: 'Sancerre', type: 'White', region: 'Loire, France', price: 55, tags: ['Crisp', 'Citrus'], pairings: ['Goat Cheese', 'Seafood'], image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Provence Rosé', type: 'Rose', region: 'Provence, France', price: 45, tags: ['Floral', 'Dry'], pairings: ['Salad', 'Fish'], image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=200' },
    { id: '4', name: 'Prosecco Superiore', type: 'Sparkling', region: 'Veneto, Italy', price: 40, tags: ['Bubbly', 'Fruity'], pairings: ['Appetizers', 'Dessert'], image: 'https://images.unsplash.com/photo-1598155523122-38423ab4d6ce?auto=format&fit=crop&q=80&w=200' },
];

const DigitalSommelier: React.FC = () => {
  const [wines] = useState<Wine[]>(MOCK_WINES);
  const [filter, setFilter] = useState('All');
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);

  const filteredWines = filter === 'All' ? wines : wines.filter(w => w.type === filter);

  const handleOrder = (wine: Wine) => {
      toast.success(`Ordered: ${wine.name}`);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><WineIcon className="text-red-400"/> Digital Sommelier</h2>
         <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/10">
              {['All', 'Red', 'White', 'Rose', 'Sparkling'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 rounded text-xs transition ${filter === type ? 'bg-red-900/40 text-red-100 border border-red-500/30' : 'text-zinc-500 hover:text-white'}`}
                  >
                      {type}
                  </button>
              ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWines.map(wine => (
                <div key={wine.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden flex flex-col group hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition duration-300">
                    <div className="h-48 overflow-hidden relative">
                        <img src={wine.image} alt={wine.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/20">
                            ${wine.price}
                        </div>
                        <button 
                            onClick={() => setSelectedWine(wine)}
                            className="absolute bottom-2 right-2 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0"
                            title="See Details"
                        >
                            <Info size={16}/>
                        </button>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-white">{wine.name}</h3>
                                <p className="text-zinc-400 text-sm">{wine.region}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 my-4">
                            {wine.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs text-zinc-300 border border-white/10">{tag}</span>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/10">
                            <div className="text-xs text-zinc-500 mb-2 font-bold uppercase tracking-wider">Perfect Pairings</div>
                            <div className="flex flex-wrap gap-2">
                                {wine.pairings.map(pair => (
                                    <span key={pair} className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
                                        <ThumbsUp size={10} /> {pair}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <Button onClick={() => handleOrder(wine)} className="w-full bg-red-800 hover:bg-red-700 border-none">Add Bottle to Order</Button>
                    </div>
                </div>
            ))}
      </div>

      {/* Detail Modal (Simplified as Overlay for Demo) */}
      {selectedWine && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedWine(null)}>
              <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelectedWine(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><Info size={24} className="rotate-45"/></button>
                  <div className="flex gap-6">
                      <img src={selectedWine.image} alt={selectedWine.name} className="w-32 h-48 object-cover rounded-lg shadow-lg" />
                      <div>
                          <h2 className="text-3xl font-bold text-white mb-2">{selectedWine.name}</h2>
                          <div className="text-red-400 font-mono text-xl mb-4">${selectedWine.price}</div>
                          <p className="text-zinc-300 mb-6">A prestigious wine from {selectedWine.region}, known for its {selectedWine.tags.join(' and ')} character. Excellent with {selectedWine.pairings.join(' or ')}.</p>
                          <div className="flex gap-4">
                            <Button onClick={() => { handleOrder(selectedWine); setSelectedWine(null); }} className="flex-1 bg-red-600 hover:bg-red-500">Order Bottle</Button>
                            <Button variant="outline" className="flex-1">Add to Favorites</Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DigitalSommelier;
