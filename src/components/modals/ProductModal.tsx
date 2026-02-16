import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShieldAlert, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Tag from '../ui/Tag';
import { type MenuItem } from '../../types';
import { DICTIONARY } from '../../lib/constants';

interface ProductModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (item: any) => void;
  stock: number;
  menuItems: MenuItem[];
  happyHour: boolean;
  language?: string;
  surgePricing: boolean;
  showMacros: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onAddToOrder, 
  stock, 
  menuItems, 
  happyHour, 
  language = 'en', 
  surgePricing, 
  showMacros 
}) => {
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [course, setCourse] = useState('main'); 
  const [isClosing, setIsClosing] = useState(false);
  const [displayItem, setDisplayItem] = useState<MenuItem | null>(item);

  useEffect(() => { 
    if (item) {
      setDisplayItem(item);
      const initialOptions: Record<string, string> = {};
      item.options?.forEach(opt => { initialOptions[opt.name] = opt.choices[0]; });
      setSelectedOptions(initialOptions);
      setCourse('main');
    }
  }, [item]);

  useEffect(() => { if (isOpen) { setQuantity(1); setNotes(''); setIsClosing(false); } }, [isOpen]);

  const handleClose = () => { setIsClosing(true); setTimeout(() => { onClose(); setIsClosing(false); }, 300); };

  const handleAdd = (itemToAdd = displayItem) => {
    if (itemToAdd && stock > 0) {
      const optionsString = Object.entries(selectedOptions).map(([key, val]) => `${key}: ${val}`).join(', ');
      const finalNotes = optionsString ? `${optionsString}. ${notes}` : notes;
      
      let finalPrice = itemToAdd.price;
      if (happyHour && itemToAdd.category === 'coffee') finalPrice = finalPrice * 0.8; 
      if (surgePricing) finalPrice = finalPrice * 1.1;

      onAddToOrder({ ...itemToAdd, price: finalPrice, notes: finalNotes, quantity, course });
      handleClose();
    }
  };

  const getPairingItem = (id: string) => menuItems.find(i => i.id === id);

  if (!isOpen && !isClosing) return null;
  if (!displayItem) return null;

  const isSoldOut = stock <= 0;
  const isHappyHourEligible = happyHour && displayItem.category === 'coffee';
  const t = DICTIONARY[language];
  const translatedName = displayItem.translations?.[language]?.name || displayItem.name;
  const translatedDesc = displayItem.translations?.[language]?.description || displayItem.description;
  
  let currentPrice = displayItem.price;
  if (isHappyHourEligible) currentPrice *= 0.8;
  if (surgePricing) currentPrice *= 1.1;

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 ${isClosing ? 'pointer-events-none' : ''}`}>
      <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} />
      <div className={`relative w-full max-w-4xl bg-[#121212] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row max-h-[90vh] transition-transform duration-500 ease-out ${isClosing ? 'translate-y-full sm:translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="w-full sm:w-1/2 h-64 sm:h-auto relative">
          <img src={displayItem.image} alt={displayItem.name} className={`w-full h-full object-cover ${isSoldOut ? 'grayscale' : ''}`} />
          {isSoldOut && <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"><span className="text-3xl font-bold text-white border-4 border-white p-4 rotate-[-15deg] uppercase">{t.soldOut}</span></div>}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#121212]" />
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors sm:hidden"><X size={20} /></button>
        </div>
        <div className="flex-1 p-6 sm:p-10 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-2"><div>{displayItem.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}</div><button onClick={handleClose} className="hidden sm:block text-white/40 hover:text-white transition-colors"><X size={24} /></button></div>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-2 mt-4">{translatedName}</h2>
          <div className="flex items-center gap-3 mb-6">
             <div className="flex items-center gap-2">
                 {displayItem.price !== currentPrice && <div className="text-xl text-white/40 line-through">${displayItem.price}</div>}
                 <div className="text-2xl text-[#d94e28] font-serif">${currentPrice.toFixed(2)}</div>
                 {isHappyHourEligible && <span className="text-xs bg-[#d94e28] text-white px-2 py-1 rounded-full font-bold">HAPPY HOUR -20%</span>}
                 {surgePricing && !isHappyHourEligible && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">PEAK +10%</span>}
             </div>
             {stock > 0 && stock < 5 && <span className="text-xs font-bold text-orange-400 border border-orange-400/30 bg-orange-400/10 px-2 py-1 rounded">Only {stock} left!</span>}
          </div>
          
          {showMacros && displayItem.macros && (
             <div className="flex gap-4 mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-center"><span className="block text-xs text-white/40 uppercase">Protein</span><span className="font-bold">{displayItem.macros.protein}</span></div>
                <div className="text-center"><span className="block text-xs text-white/40 uppercase">Carbs</span><span className="font-bold">{displayItem.macros.carbs}</span></div>
                <div className="text-center"><span className="block text-xs text-white/40 uppercase">Fats</span><span className="font-bold">{displayItem.macros.fat}</span></div>
             </div>
          )}

          <p className="text-white/60 leading-relaxed mb-6">{translatedDesc}</p>
          
          {displayItem.allergens && displayItem.allergens.length > 0 && (
             <div className="flex gap-2 mb-6 flex-wrap">{displayItem.allergens.map(a => <span key={a} className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-full uppercase font-bold"><ShieldAlert size={12}/> Contains {a}</span>)}</div>
          )}
          
          {!isSoldOut && (
            <div className="space-y-6 mb-8">
              {displayItem.pairings && displayItem.pairings.length > 0 && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="text-xs font-bold text-[#d94e28] uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles size={14}/> Chef Recommends Pairing With</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {displayItem.pairings.map(pid => {
                      const pItem = getPairingItem(pid);
                      if (!pItem) return null;
                      return (
                        <div key={pid} className="flex-shrink-0 w-32 bg-black/40 rounded-lg p-2 border border-white/5 group hover:border-white/20 transition-all cursor-pointer" onClick={() => onAddToOrder({...pItem, quantity: 1, course: 'main'})}>
                          <img src={pItem.image} className="w-full h-20 object-cover rounded-md mb-2" alt={pItem.name} />
                          <div className="text-xs font-bold text-white truncate">{pItem.name}</div>
                          <div className="text-xs text-[#d94e28]">+${pItem.price}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              <div><label className="text-sm font-bold text-white mb-3 block">When should we serve this?</label><div className="flex gap-2 bg-white/5 p-1 rounded-xl">{['starter', 'main', 'dessert'].map(c => <button key={c} onClick={() => setCourse(c)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${course === c ? 'bg-[#d94e28] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>{c}</button>)}</div></div>
              {displayItem.options?.map((opt, idx) => (
                <div key={idx}>
                  <label className="text-sm font-bold text-white mb-3 block">{opt.name}</label>
                  <div className="flex flex-wrap gap-2">{opt.choices.map(choice => <button key={choice} onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: choice }))} className={`px-4 py-2 rounded-lg text-sm border transition-all ${selectedOptions[opt.name] === choice ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-white/60 hover:border-white/40'}`}>{choice}</button>)}</div>
                </div>
              ))}
              <div><label className="text-sm text-white/60 mb-2 block">Special Requests</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, etc..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-[#d94e28]/50 transition-colors resize-none h-24" /></div>
            </div>
          )}
          <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-4">
            {!isSoldOut ? (
              <>
                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-1 border border-white/10"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-white/10 rounded-lg text-white transition-colors"><Minus size={16} /></button><span className="w-8 text-center font-mono text-lg">{quantity}</span><button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="p-3 hover:bg-white/10 rounded-lg text-white transition-colors"><Plus size={16} /></button></div>
                <Button onClick={() => handleAdd()} className="flex-1 py-4 text-lg">{t.addOrder}</Button>
              </>
            ) : <Button disabled variant="secondary" className="w-full py-4 text-lg bg-white/10 text-white/50 cursor-not-allowed">{t.soldOut}</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
