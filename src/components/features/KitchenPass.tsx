import React, { useMemo, useState } from 'react';
import { CheckSquare, ChefHat, Clock, Flame, Coffee } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

import useSound from '../../hooks/useSound';

const KitchenPass: React.FC = () => {
  const { kitchenOrders } = useStore();
  const [filter, setFilter] = useState<'all' | 'kitchen' | 'bar'>('all');
  const playSound = useSound();
  const prevCount = React.useRef(kitchenOrders.length);

  React.useEffect(() => {
      if (kitchenOrders.length > prevCount.current) {
          playSound('notification');
          toast('New Order Received!', { icon: '🔔' });
      }
      prevCount.current = kitchenOrders.length;
  }, [kitchenOrders.length, playSound]);

  const activeOrders = useMemo(() => {
    return kitchenOrders.filter(o => 
        (o.status === 'pending' || o.status === 'preparing') &&
        (filter === 'all' || o.items.some(i => i.station === filter))
    );
  }, [kitchenOrders, filter]);

  const handleComplete = (orderId: string) => {
      store.updateKitchenOrderStatus(orderId, 'ready');
      toast.success('Order Marked Ready');
  };

  const getElapsedTime = (date: any) => {
      if (!date) return '0m';
      const start = new Date(date).getTime();
      const now = new Date().getTime();
      return Math.floor((now - start) / 60000) + 'm';
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
           <div className="flex items-center gap-4">
               <h2 className="text-2xl font-bold text-white font-serif">Kitchen Pass</h2>
               <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                   <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[#d94e28] text-white' : 'text-zinc-400 hover:text-white'}`}>All</button>
                   <button onClick={() => setFilter('kitchen')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'kitchen' ? 'bg-[#d94e28] text-white' : 'text-zinc-400 hover:text-white'}`}><Flame size={14} className="inline mr-1"/> Kitchen</button>
                   <button onClick={() => setFilter('bar')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'bar' ? 'bg-[#d94e28] text-white' : 'text-zinc-400 hover:text-white'}`}><Coffee size={14} className="inline mr-1"/> Bar</button>
               </div>
           </div>
           
           <div className="flex gap-4 text-sm font-mono text-zinc-400">
               <span>Pending: {activeOrders.filter(o => o.status === 'pending').length}</span>
               <span>Preparing: {activeOrders.filter(o => o.status === 'preparing').length}</span>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {activeOrders.map(order => (
               <div key={order.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[400px] shadow-lg relative animate-in fade-in zoom-in duration-300">
                   {/* Header */}
                   <div className={`p-3 border-b border-white/10 flex justify-between items-center ${order.status === 'pending' ? 'bg-yellow-500/10' : 'bg-blue-500/10'}`}>
                       <div>
                           <div className="font-bold text-lg text-white">Table {order.tableId}</div>
                           <div className="text-xs text-zinc-400 font-mono">#{order.id.slice(-4)}</div>
                       </div>
                       <div className="flex flex-col items-end">
                           <div className="flex items-center gap-1 text-orange-400 font-mono font-bold text-sm">
                               <Clock size={12}/> {getElapsedTime(order.createdAt)}
                           </div>
                           <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-400'}`}>
                               {order.status}
                           </div>
                       </div>
                   </div>

                   {/* Items */}
                   <div className="flex-1 overflow-y-auto p-4 space-y-3">
                       {order.items.map((item, idx) => (
                           <div key={idx} className="flex gap-3 group">
                              <div className="pt-1">
                                  <div className="w-5 h-5 border border-white/20 rounded flex items-center justify-center cursor-pointer hover:border-green-500 hover:text-green-500 transition-colors">
                                      <CheckSquare size={12} className="opacity-0 group-hover:opacity-100"/>
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <div className="text-sm text-white font-medium">
                                      <span className="text-[#d94e28] font-bold mr-1">{item.quantity}x</span> 
                                      {item.name}
                                  </div>
                                  {item.notes && <div className="text-xs text-yellow-500/80 italic mt-0.5">Note: {item.notes}</div>}
                                  {item.options?.length > 0 && (
                                     <div className="text-xs text-zinc-500 mt-0.5">
                                         {item.options.map(opt => Object.values(opt).join(', ')).join(', ')}
                                     </div>
                                  )}
                              </div>
                           </div>
                       ))}
                   </div>

                   {/* Action */}
                   <div className="p-3 border-t border-white/10 bg-black/20">
                       <Button onClick={() => handleComplete(order.id)} className="w-full bg-green-600 hover:bg-green-500 h-10 text-sm">
                           Complete Order
                       </Button>
                   </div>
               </div>
           ))}

           {activeOrders.length === 0 && (
               <div className="col-span-full h-96 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-xl">
                   <ChefHat size={64} className="mb-4"/>
                   <p className="text-xl font-serif">All caught up, Chef!</p>
               </div>
           )}
       </div>
    </div>
  );
};

export default KitchenPass;
