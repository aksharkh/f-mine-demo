import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, X } from 'lucide-react';
import { type MenuItem } from '../../types';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { CATEGORIES } from '../../lib/constants';
import { toast } from 'react-hot-toast';

const MenuEditor: React.FC = () => {
  const { menuItems } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Item Form State (Simplified)
  const [formData, setFormData] = useState<Partial<MenuItem>>({});

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this item?')) {
          store.deleteMenuItem(id);
          toast.success('Item Deleted');
      }
  };

  const handleSave = () => {
      if (!formData.name || !formData.price || !formData.category) {
          toast.error('Please fill in required fields');
          return;
      }

      if (editingId) {
          // Update
          store.updateMenuItem(editingId, formData);
          setEditingId(null);
          toast.success('Item Updated');
      } else {
          // Create
          const newItem = { 
              ...formData, 
              id: Math.random().toString(36).substr(2, 9),
              tags: [], // Default
              options: [], // Default
              dietary: [], // Default
              image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
          } as MenuItem;
          store.addMenuItem(newItem);
          toast.success('Item Created');
      }
      setFormData({});
  };

  const handleCancel = () => {
      setEditingId(null);
      setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-white/10 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
          <h2 className="text-2xl font-bold text-white font-serif">Menu Management</h2>
          <Button onClick={() => { setEditingId(null); setFormData({}); }} className="gap-2" variant={editingId ? "outline" : "primary"}><Plus size={16}/> Add New Item</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Form */}
          <div className="lg:col-span-1">
            <div className={`bg-[#1a1a1a] p-6 rounded-xl border border-white/10 sticky top-24 transition-all duration-300 ${editingId || Object.keys(formData).length > 0 ? 'opacity-100 translate-x-0' : 'opacity-50 grayscale pointer-events-none'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
                    {(editingId || Object.keys(formData).length > 0) && <button onClick={handleCancel}><X size={16} className="text-zinc-500 hover:text-white"/></button>}
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-white/40 block mb-1">Name</label>
                        <input 
                            type="text" 
                            value={formData.name || ''} 
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#d94e28] outline-none transition-colors"
                            placeholder="e.g. Truffle Burger"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-white/40 block mb-1">Price ($)</label>
                            <input 
                                type="number" 
                                value={formData.price || ''} 
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#d94e28] outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-white/40 block mb-1">Category</label>
                            <select 
                                value={formData.category || ''} 
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#d94e28] outline-none"
                            >
                                <option value="" disabled>Select...</option>
                                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-white/40 block mb-1">Description</label>
                        <textarea 
                            value={formData.description || ''} 
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#d94e28] h-24 outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-white/40 block mb-1">Image URL</label>
                        <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={formData.image || ''} 
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#d94e28] outline-none"
                            placeholder="https://..."
                        />
                        <div className="w-10 h-10 bg-white/5 rounded border border-white/10 flex items-center justify-center overflow-hidden">
                            {formData.image ? <img src={formData.image} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} /> : <ImageIcon size={16} className="text-white/20"/>}
                        </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                        <Button onClick={handleSave} className="flex-1 gap-2"><Save size={16}/> {editingId ? 'Update' : 'Create'}</Button>
                        {editingId && <Button onClick={handleCancel} className="bg-transparent border border-white/10 text-zinc-400 hover:text-white">Cancel</Button>}
                    </div>
                </div>
            </div>
          </div>

          {/* Items List */}
          <div className="lg:col-span-2 space-y-3 pb-20">
              {menuItems.map(item => (
                  <div key={item.id} className={`flex gap-4 p-4 rounded-xl border transition-all group ${editingId === item.id ? 'bg-[#d94e28]/10 border-[#d94e28]' : 'bg-[#1a1a1a] border-white/10 hover:border-white/20'}`}>
                      <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-white/5" />
                      <div className="flex-1">
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white text-lg">{item.name}</h4>
                              <span className="font-mono text-lg font-medium text-green-400">${item.price}</span>
                          </div>
                          <p className="text-sm text-zinc-400 line-clamp-2 mt-1 mb-3">{item.description}</p>
                          <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(item)} className="text-xs flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded hover:bg-white/10 text-white transition-colors"><Edit2 size={12}/> Edit</button>
                              <button onClick={() => handleDelete(item.id)} className="text-xs flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 size={12}/> Delete</button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default MenuEditor;
