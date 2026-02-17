import React, { useState } from 'react';
import { Package, AlertTriangle, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const InventoryManager: React.FC = () => {
  const { inventory } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', stock: 0, lowStockThreshold: 5, unit: 'pcs' });

  const handleRestock = (id: string, amount: number) => {
      const item = inventory.find(i => i.id === id);
      if (item) {
          store.updateInventoryItem(id, { stock: item.stock + amount });
          toast.success('Stock Updated');
      }
  };

  const addItem = () => {
      if (!newItem.name) return;
      const id = `ing-${Date.now()}`;
      store.addInventoryItem({
          id,
          ...newItem
      });
      setNewItem({ name: '', stock: 0, lowStockThreshold: 5, unit: 'pcs' });
      setShowAddForm(false);
      toast.success('New Item Added');
  };

  const deleteItem = (id: string) => {
      if (confirm('Delete this inventory item?')) {
          store.deleteInventoryItem(id);
          toast.success('Item Removed');
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white font-serif flex items-center gap-2"><Package /> Inventory Management</h2>
        <div className="flex gap-2">
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline"><Plus size={16}/> Add Item</Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-500"><RefreshCw size={16}/> Sync Suppliers</Button>
        </div>
      </div>

      {showAddForm && (
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end mb-6 animate-in slide-in-from-top-2">
               <div>
                   <label className="text-xs text-zinc-400 block mb-1">Name</label> 
                   <input className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Item Name"/>
               </div>
               <div>
                   <label className="text-xs text-zinc-400 block mb-1">Stock</label> 
                   <input type="number" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})} />
               </div>
               <div>
                   <label className="text-xs text-zinc-400 block mb-1">Unit</label> 
                   <input className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} placeholder="kg, pcs, L"/>
               </div>
               <Button onClick={addItem} variant="primary">Save Item</Button>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
            const isLow = item.stock <= (item.lowStockThreshold || 0);
            const isOut = item.stock === 0;

            return (
                <div key={item.id} className={`p-6 rounded-xl border transition-all relative group ${isOut ? 'bg-red-900/10 border-red-500/50' : isLow ? 'bg-yellow-900/10 border-yellow-500/50' : 'bg-[#1a1a1a] border-white/10'}`}>
                    <button onClick={() => deleteItem(item.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition text-zinc-500 hover:text-red-400"><Trash2 size={16}/></button>

                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isLow || isOut ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white/40'}`}>
                                <Package size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                <div className="text-xs text-white/40">Threshold: {item.lowStockThreshold} {item.unit}</div>
                            </div>
                        </div>
                        {(isLow || isOut) && <AlertTriangle size={18} className="text-yellow-500 animate-pulse" />}
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                        <div>
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter">{item.stock}</span>
                            <span className="text-sm text-white/40 ml-1">{item.unit}</span>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => handleRestock(item.id, 10)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-colors border border-white/5">+10</button>
                            <button onClick={() => handleRestock(item.id, 50)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-colors border border-white/5">+50</button>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-black/40 rounded-full mt-4 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${isOut ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(100, (item.stock / 100) * 100)}%` }}
                        />
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default InventoryManager;
