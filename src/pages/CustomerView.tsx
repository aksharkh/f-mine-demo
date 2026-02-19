import React, { useState, useMemo, useEffect } from 'react';
import { 
  Megaphone, PartyPopper, Sun, Moon, Star, Gamepad2, Gift, Search, User, FileText, 
  Dumbbell, Heart, Timer, X, AlertTriangle, Plus
} from 'lucide-react';
import { type MenuItem, type Order } from '../types';
import { CATEGORIES, DIETARY_FILTERS, DICTIONARY, CURRENCIES } from '../lib/constants';
import Button from '../components/ui/Button';
import ProductModal from '../components/modals/ProductModal';
import TriviaGame from '../components/modals/TriviaGame';
import GiftModal from '../components/modals/GiftModal';
import CountdownTimer from '../components/ui/CountdownTimer';

interface CustomerViewProps {
  tableId: string;
  user: any;
  activeOrder: Order | null;
  onPlaceOrder: (cart: any[], tableId?: string) => void;
  onCallWaiter: (type: string) => void;
  onRequestBill: () => void;
  menuItems: MenuItem[];
  addToCart: (item: any) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  availability: Record<string, { stock: number }>;
  orderHistory: Order[];
  happyHour: boolean;
  announcement: string;
  language: string;
  setLanguage: (lang: string) => void;
  surgePricing: boolean;
  currency: string;
  setCurrency: (curr: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ 
  tableId, 
  // user, 
  activeOrder, 
  onCallWaiter, 
  onRequestBill, 
  menuItems, 
  addToCart, 
  activeCategory, 
  setActiveCategory, 
  availability, 
  orderHistory, 
  happyHour, 
  announcement, 
  language, 
  setLanguage, 
  surgePricing, 
  currency, 
  setCurrency, 
  theme, 
  setTheme 
}) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [showMacros, setShowMacros] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const [showGift, setShowGift] = useState(false);

  const t = DICTIONARY[language];
  const curr = CURRENCIES[currency];
  const loyaltyPoints = orderHistory.length * 15;
  const loyaltyTier = loyaltyPoints > 500 ? 'Gold' : loyaltyPoints > 200 ? 'Silver' : 'Bronze';
  const specials = menuItems.filter(i => i.category === 'signature').slice(0, 3);

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory === 'favorites') items = items.filter(item => favorites.includes(item.id));
    else if (activeCategory !== 'all') items = items.filter(item => item.category === activeCategory);
    
    if (activeFilters.length > 0) items = items.filter(item => activeFilters.every(f => item.dietary?.includes(f as any)));
    if (selectedMood) items = items.filter(item => item.moods?.includes(selectedMood));
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().includes(q) || item.tags.some((t: string) => t.toLowerCase().includes(q)));
    }
    return items;
  }, [activeCategory, menuItems, searchQuery, favorites, activeFilters, selectedMood]);

  useEffect(() => { 
    const timer = setInterval(() => setCurrentSpecialIndex(prev => (prev + 1) % specials.length), 5000); 
    return () => clearInterval(timer); 
  }, [specials.length]);
  
  const toggleFilter = (id: string) => setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  const toggleFavorite = (e: React.MouseEvent, id: string) => { 
    e.stopPropagation(); 
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); 
  };

  const serviceOptions = [
    { id: 'water', label: 'Water', icon: '💧' }, 
    { id: 'cutlery', label: 'Cutlery', icon: '🍴' },
    { id: 'napkins', label: 'Napkins', icon: '📄' },
    { id: 'waiter', label: 'Help', icon: '👤' },
    { id: 'car', label: 'Valet', icon: '🚗' },
  ];

  return (
    <div className={`animate-in fade-in duration-700 ${theme === 'light' ? 'light-mode bg-[#f4f4f5] text-black' : 'dark-mode text-white'}`}>
      {theme === 'dark' && <div className="noise-bg" />}

      {announcement && (
        <div className="bg-blue-600 text-white text-center py-2 font-bold uppercase tracking-widest text-xs fixed top-20 left-0 right-0 z-30 flex items-center justify-center gap-2">
          <Megaphone size={14} /> {announcement}
        </div>
      )}

      {happyHour && (
        <div className={`bg-[#d94e28] text-white text-center py-2 font-bold uppercase tracking-widest text-xs animate-pulse fixed ${announcement ? 'top-28' : 'top-20'} left-0 right-0 z-20`}>
          <PartyPopper size={14} className="inline mr-2" /> Happy Hour Active! 20% Off All Drinks <PartyPopper size={14} className="inline ml-2" />
        </div>
      )}

      <div className={`relative h-[45vh] min-h-[400px] overflow-hidden mb-8 transition-all duration-700 group ${happyHour || announcement ? 'mt-8' : ''}`}>
         {specials.map((item, index) => (
           <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSpecialIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-110" style={{ backgroundImage: `url(${item.image})` }} />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
             <div className="absolute bottom-0 left-0 p-8 max-w-2xl animate-in slide-in-from-left duration-1000">
                <span className="inline-block py-1 px-3 rounded-full bg-[#d94e28] text-white text-xs tracking-[0.2em] uppercase mb-4 shadow-lg shadow-orange-500/30">{t.special}</span>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight text-glow">{item.translations?.[language]?.name || item.name}</h2>
                <Button onClick={() => setSelectedItem(item)} className="shadow-xl">{t.orderNow} — {curr.symbol}{(item.price * curr.rate).toFixed(2)}</Button>
             </div>
           </div>
         ))}
         <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-2">
            <div className="flex gap-2">
               <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="bg-black/40 rounded-full border border-white/20 p-2 text-white hover:bg-white hover:text-black transition-colors">{theme === 'dark' ? <Sun size={14}/> : <Moon size={14}/>}</button>
               <div className="py-2 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-[0.2em] uppercase text-white font-bold">Table {tableId}</div>
            </div>
            
            <div className="flex gap-1">
               {/* Language Toggle */}
               <div className="flex bg-black/40 rounded-full border border-white/20 p-1">
                  {['en', 'es', 'fr'].map(lang => (
                    <button key={lang} onClick={() => setLanguage(lang)} className={`px-2 py-1 rounded-full text-xs uppercase font-bold transition-colors ${language === lang ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>{lang}</button>
                  ))}
               </div>
               {/* Currency Toggle */}
               <div className="flex bg-black/40 rounded-full border border-white/20 p-1">
                  {['USD', 'EUR', 'GBP'].map(c => (
                    <button key={c} onClick={() => setCurrency(c)} className={`px-2 py-1 rounded-full text-xs uppercase font-bold transition-colors ${currency === c ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>{c}</button>
                  ))}
               </div>
            </div>

            {/* Loyalty Tier */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-xl p-3 w-48 shadow-xl">
               <div className="flex justify-between items-center mb-1"><span className="text-[10px] uppercase text-white/40 tracking-wider">{t.rewards} - {loyaltyTier}</span><Star size={12} className="text-[#d94e28]" fill="currentColor"/></div>
               <div className="text-xl font-serif text-white">{loyaltyPoints} <span className="text-sm font-sans text-white/40">{t.pts}</span></div>
               <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#d94e28]" style={{ width: `${(loyaltyPoints % 200) / 2}%` }}></div></div>
            </div>

            {/* Extras Buttons */}
            <div className="flex gap-2 mt-2">
               <button onClick={() => setShowTrivia(true)} className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/30 hover:bg-purple-500/40"><Gamepad2 size={12}/> Play Trivia</button>
               <button onClick={() => setShowGift(true)} className="flex items-center gap-1 bg-pink-500/20 text-pink-300 px-3 py-1 rounded-lg text-xs font-bold border border-pink-500/30 hover:bg-pink-500/40"><Gift size={12}/> Gift Table</button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 sticky top-24 z-30 pointer-events-none space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center pointer-events-auto">
            <div className="relative w-full md:max-w-md group">
                <Search className="absolute left-4 top-3.5 h-5 w-5 opacity-40 group-focus-within:text-[#d94e28] transition-colors" />
                <input 
                    type="text" 
                    placeholder={t.search} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className={`w-full backdrop-blur-xl border rounded-full py-3.5 pl-12 pr-6 placeholder-opacity-50 focus:outline-none shadow-lg transition-all ${theme === 'light' ? 'bg-white/90 border-black/10 text-black focus:ring-2 focus:ring-black/5' : 'bg-[#121212]/90 border-white/10 text-white focus:ring-2 focus:ring-white/10'}`} 
                />
            </div>
            
            <div className="relative w-full md:w-auto flex justify-center md:justify-end">
               {!showCallMenu ? (
                   <div className={`flex gap-3 p-1.5 rounded-2xl backdrop-blur-xl border shadow-xl ${theme === 'light' ? 'bg-white/95 border-black/10' : 'bg-[#121212]/95 border-white/10'}`}>
                       <button onClick={() => setShowCallMenu(true)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${theme === 'light' ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                           <User size={18}/> {t.service}
                       </button>
                       <button onClick={onRequestBill} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${theme === 'light' ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                           <FileText size={18}/> {t.bill}
                       </button>
                   </div>
               ) : (
                   <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-[#121212] border border-white/20 shadow-2xl animate-in slide-in-from-right w-full md:w-auto">
                       {serviceOptions.map(opt => (
                           <button key={opt.id} onClick={() => { onCallWaiter(opt.id); setShowCallMenu(false); }} className="flex flex-col items-center justify-center w-16 h-16 bg-white/5 hover:bg-[#d94e28] rounded-xl text-white transition-colors" title={opt.label}>
                               <span className="text-xl mb-1">{opt.icon}</span>
                               <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                           </button>
                       ))}
                       <button onClick={() => setShowCallMenu(false)} className="flex items-center justify-center w-16 h-16 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
                           <X size={20} />
                       </button>
                   </div>
               )}
            </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap justify-center gap-2 md:gap-3">
            {DIETARY_FILTERS.map((filter: any) => (
                <button key={filter.id} onClick={() => toggleFilter(filter.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 ${activeFilters.includes(filter.id) ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/20 border-transparent hover:border-white/20 text-white/60 hover:text-white'}`}>
                    <filter.icon size={14}/> {filter.label}
                </button>
            ))}
            <button onClick={() => setShowMacros(!showMacros)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 ${showMacros ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-black/20 border-transparent hover:border-white/20 text-white/60 hover:text-white'}`}>
                <Dumbbell size={14}/> {showMacros ? 'Hide Macros' : 'Macros'}
            </button>
        </div>

        {/* Mood Selector - Scrollable Container */}
        <div className="pointer-events-auto w-full overflow-x-auto pb-2 scrollbar-hide">
           <div className="flex justify-start md:justify-center gap-3 min-w-max px-4">
               {['comfort', 'healthy', 'energizing', 'indulgent', 'quick'].map(mood => (
                 <button key={mood} onClick={() => setSelectedMood(selectedMood === mood ? null : mood)} className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold border transition-all active:scale-95 ${selectedMood === mood ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/20 border-transparent hover:border-white/20 text-white/60 hover:text-white'}`}>
                    {mood}
                 </button>
               ))}
           </div>
        </div>
      </div>

      <div className="sticky top-[88px] z-20 bg-inherit backdrop-blur-xl border-y border-white/5 py-3 md:py-4 mb-8 transition-colors duration-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 md:gap-4 min-w-max pb-1">
              {CATEGORIES.map((cat: any) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex flex-col md:flex-row items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-full border transition-all duration-300 active:scale-95 ${activeCategory === cat.id ? 'bg-[#d94e28] text-white border-[#d94e28] shadow-lg shadow-orange-500/20 scale-105' : 'bg-white/5 hover:bg-white/10 border-transparent text-white/60 hover:text-white'}`}>
                  <cat.icon size={18} className={activeCategory === cat.id ? 'animate-bounce' : ''}/>
                  <span className="text-xs md:text-sm font-medium tracking-wide whitespace-nowrap">{cat.name}</span>
                </button>
              ))}
              <div className="w-[1px] bg-white/10 mx-2"></div>
              <button onClick={() => setActiveCategory('favorites')} className={`flex flex-col md:flex-row items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-full border transition-all duration-300 ${activeCategory === 'favorites' ? 'bg-pink-500/20 text-pink-400 border-pink-500 shadow-lg shadow-pink-500/20' : 'bg-white/5 hover:bg-white/10 border-transparent text-white/60 hover:text-white'}`}>
                <Heart size={18} fill={activeCategory === 'favorites' ? "currentColor" : "none"} />
                <span className="text-xs md:text-sm font-medium">{t.favorites}</span>
              </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
        {filteredItems.map(item => {
            const stock = availability[item.id]?.stock ?? 20;
            const isSoldOut = stock <= 0;
            const isLowStock = stock < 5 && stock > 0;
            let displayPrice = item.price;
            if (happyHour && item.category === 'coffee') displayPrice *= 0.8;
            if (surgePricing) displayPrice *= 1.1;

            return (
              <div key={item.id} onClick={() => setSelectedItem(item)} className={`group relative cursor-pointer border rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isSoldOut ? 'opacity-75 grayscale' : ''} ${theme === 'light' ? 'bg-white border-gray-100 hover:border-gray-300 shadow-sm' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20 shadow-lg'}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  
                  <button onClick={(e) => toggleFavorite(e, item.id)} className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all z-10 active:scale-90"><Heart size={20} fill={favorites.includes(item.id) ? "currentColor" : "none"} className={favorites.includes(item.id) ? "text-red-500" : ""} /></button>
                  
                  {isSoldOut && <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-10"><span className="px-6 py-2 border-2 border-white text-white font-bold uppercase tracking-widest -rotate-12 bg-black/40 backdrop-blur-xl shadow-2xl">{t.soldOut}</span></div>}
                  
                  {isLowStock && !isSoldOut && <div className="absolute top-3 left-3 z-10"><span className="px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-lg shadow-lg animate-pulse flex items-center gap-1"><AlertTriangle size={10}/> Only {stock} Left</span></div>}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex justify-between items-end mb-1">
                        {item.tags.length > 0 ? (
                            <div className="flex gap-1.5">{item.tags.slice(0, 2).map((tag: string, i: number) => <span key={i} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider">{tag}</span>)}</div>
                        ) : <div></div>}
                        <div className="flex flex-col items-end">
                           {happyHour && item.category === 'coffee' && <span className="text-[10px] bg-[#d94e28] text-white px-1.5 py-0.5 rounded mb-1 font-bold">-20%</span>}
                           <span className="text-xl font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">{curr.symbol}{(displayPrice * curr.rate).toFixed(2)}</span>
                        </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className={`text-lg font-bold leading-tight group-hover:text-[#d94e28] transition-colors ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{item.translations?.[language]?.name || item.name}</h3>
                      <div className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-white/5 text-white/40'} group-hover:bg-[#d94e28] group-hover:text-white transition-colors`}>
                        <Plus size={16} />
                      </div>
                  </div>
                  <p className={`text-sm leading-relaxed line-clamp-2 mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{item.translations?.[language]?.description || item.description}</p>
                  
                  {showMacros && item.macros && (
                     <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-dashed border-gray-700/50">
                        <div className="bg-white/5 rounded p-1 text-center"><div className="text-[10px] opacity-50 uppercase">Protein</div><div className="text-xs font-bold">{item.macros.protein}</div></div>
                        <div className="bg-white/5 rounded p-1 text-center"><div className="text-[10px] opacity-50 uppercase">Carbs</div><div className="text-xs font-bold">{item.macros.carbs}</div></div>
                        <div className="bg-white/5 rounded p-1 text-center"><div className="text-[10px] opacity-50 uppercase">Fat</div><div className="text-xs font-bold">{item.macros.fat}</div></div>
                     </div>
                  )}
                </div>
              </div>
            );
        })}
      </div>

      <ProductModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} onAddToOrder={addToCart} stock={selectedItem ? (availability[selectedItem.id]?.stock ?? 20) : 0} menuItems={menuItems} happyHour={happyHour} language={language} surgePricing={surgePricing} showMacros={showMacros} />
      <TriviaGame isOpen={showTrivia} onClose={() => setShowTrivia(false)} />
      <GiftModal isOpen={showGift} onClose={() => setShowGift(false)} menuItems={menuItems} />

      {activeOrder && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212] border-t border-white/10 pb-safe animate-in slide-in-from-bottom duration-500">
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white font-serif text-lg">{t.orderProgress}</h4>
                {activeOrder.estimatedCompletion ? (
                  <p className="text-[#d94e28] text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
                    <Timer size={12} />Ready in <CountdownTimer targetDate={activeOrder.estimatedCompletion} />
                  </p>
                ) : (
                  <p className="text-white/40 text-xs uppercase tracking-widest">Awaiting kitchen confirmation</p>
                )}
              </div>
              <div className="px-3 py-1 bg-[#d94e28]/20 text-[#d94e28] rounded-full text-xs font-bold uppercase border border-[#d94e28]/20 animate-pulse">
                {activeOrder.status === 'pending' ? t.sent : activeOrder.status === 'preparing' ? t.cooking : t.ready}
              </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#d94e28] transition-all duration-1000 ease-in-out" style={{ width: activeOrder.status === 'pending' ? '20%' : activeOrder.status === 'preparing' ? '60%' : '100%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
