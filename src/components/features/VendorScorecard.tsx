import React, { useState } from 'react';
import { Award, TrendingUp, Edit2 } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const VendorScorecardView: React.FC = () => {
  const { vendorScorecards } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ quality: 0, delivery: 0, price: 0 });

  const startEdit = (vendor: any) => {
      setEditingId(vendor.id);
      setEditForm({ quality: vendor.qualityScore, delivery: vendor.deliveryScore, price: vendor.priceScore });
  };

  const saveEdit = (id: string) => {
      store.updateVendorScore(id, {
          qualityScore: Number(editForm.quality),
          deliveryScore: Number(editForm.delivery),
          priceScore: Number(editForm.price),
          lastReviewDate: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
      toast.success('Vendor Score Updated');
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Award /> Vendor Scorecards</h2>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {vendorScorecards.map(vendor => (
               <div key={vendor.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6">
                   <div className="flex justify-between items-start mb-4">
                       <div>
                           <h3 className="text-white font-bold text-lg">{vendor.vendorName}</h3>
                           <span className="text-zinc-500 text-sm">{vendor.category}</span>
                       </div>
                       <div className="text-right">
                           <div className="text-2xl font-black text-white">
                               {((vendor.qualityScore + vendor.deliveryScore + vendor.priceScore) / 3).toFixed(1)}
                           </div>
                           <div className="text-zinc-500 text-xs">Overall Score</div>
                       </div>
                   </div>
                   
                   {editingId === vendor.id ? (
                       <div className="space-y-3 mb-4 bg-black/20 p-3 rounded-lg border border-white/10">
                           <div className="grid grid-cols-3 gap-2">
                               <label className="text-xs text-zinc-400">Quality
                                   <input type="number" step="0.1" value={editForm.quality} onChange={e => setEditForm({...editForm, quality: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded p-1 text-white"/>
                               </label>
                               <label className="text-xs text-zinc-400">Delivery
                                   <input type="number" step="0.1" value={editForm.delivery} onChange={e => setEditForm({...editForm, delivery: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded p-1 text-white"/>
                               </label>
                               <label className="text-xs text-zinc-400">Price
                                   <input type="number" step="0.1" value={editForm.price} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded p-1 text-white"/>
                               </label>
                           </div>
                           <div className="flex gap-2">
                               <Button onClick={() => saveEdit(vendor.id)} className="w-full text-xs py-1 h-8">Save</Button>
                               <Button onClick={() => setEditingId(null)} className="w-full text-xs py-1 h-8 bg-zinc-700 hover:bg-zinc-600">Cancel</Button>
                           </div>
                       </div>
                   ) : (
                       <div className="space-y-3 mb-6">
                           <div className="space-y-1">
                               <div className="flex justify-between text-sm">
                                   <span className="text-zinc-400">Quality</span>
                                   <span className="text-green-400 font-bold">{vendor.qualityScore}</span>
                               </div>
                               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-green-500" style={{width: `${(vendor.qualityScore/10)*100}%`}}></div>
                               </div>
                           </div>
                           <div className="space-y-1">
                               <div className="flex justify-between text-sm">
                                   <span className="text-zinc-400">Delivery Speed</span>
                                   <span className="text-blue-400 font-bold">{vendor.deliveryScore}</span>
                               </div>
                               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500" style={{width: `${(vendor.deliveryScore/10)*100}%`}}></div>
                               </div>
                           </div>
                           <div className="space-y-1">
                               <div className="flex justify-between text-sm">
                                   <span className="text-zinc-400">Pricing</span>
                                   <span className="text-orange-400 font-bold">{vendor.priceScore}</span>
                               </div>
                               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-orange-500" style={{width: `${(vendor.priceScore/10)*100}%`}}></div>
                               </div>
                           </div>
                       </div>
                   )}

                   <div className="flex items-center justify-between pt-4 border-t border-white/10">
                       <span className="text-zinc-500 text-xs flex items-center gap-1">
                           <TrendingUp size={12}/> Reviewed {vendor.lastReviewDate}
                       </span>
                       <button onClick={() => startEdit(vendor)} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300">
                           <Edit2 size={12}/> Update Score
                       </button>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default VendorScorecardView;
