import React, { useState } from 'react';
import { Search, MapPin, Calendar, Plus, Check } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const LostFoundLog: React.FC = () => {
  const { lostItems } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ item: '', desc: '', loc: '' });

  const handleClaim = (id: string) => {
      store.claimLostItem(id);
      toast.success('Item Marked as Claimed');
  };

  const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      store.addLostItem({
          id: Math.random().toString(36).substr(2, 5),
          item: newItem.item,
          description: newItem.desc,
          foundLocation: newItem.loc,
          foundBy: 'Staff',
          date: new Date().toISOString().split('T')[0],
          status: 'unclaimed'
      });
      setShowForm(false);
      setNewItem({ item: '', desc: '', loc: '' });
      toast.success('Lost Item Logged');
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Search /> Lost & Found</h2>
         <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2"/> Log Item</Button>
      </div>

      {showForm && (
          <form onSubmit={handleAdd} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 mb-6 space-y-4">
              <input 
                placeholder="Item Name" 
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                required
                value={newItem.item}
                onChange={e => setNewItem({...newItem, item: e.target.value})}
              />
              <input 
                placeholder="Description" 
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                required
                value={newItem.desc}
                onChange={e => setNewItem({...newItem, desc: e.target.value})}
              />
              <input 
                placeholder="Found Location" 
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                required
                value={newItem.loc}
                onChange={e => setNewItem({...newItem, loc: e.target.value})}
              />
              <Button type="submit" className="w-full">Log Found Item</Button>
          </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostItems.map(item => (
                <div key={item.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden group">
                    <div className="h-32 bg-zinc-800 flex items-center justify-center relative">
                        {/* Placeholder for image */}
                        <Search className="text-zinc-600" size={32} />
                        {item.status === 'claimed' && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center gap-2">
                                    <Check size={14}/> CLAIMED
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4">
                        <h3 className="text-white font-bold text-lg mb-1">{item.item}</h3>
                        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="space-y-2 text-xs text-zinc-500 mb-4">
                             <div className="flex items-center gap-2"><MapPin size={14}/> Found at {item.foundLocation}</div>
                             <div className="flex items-center gap-2"><Calendar size={14}/> {item.date} • by {item.foundBy}</div>
                        </div>

                        {item.status === 'unclaimed' && (
                            <Button onClick={() => handleClaim(item.id)} className="w-full bg-zinc-700 hover:bg-zinc-600 text-sm py-2">Mark as Claimed</Button>
                        )}
                    </div>
                </div>
            ))}
      </div>
    </div>
  );
};

export default LostFoundLog;
