import React from 'react';
import { Package, Truck, Clock } from 'lucide-react';
import { type Order } from '../../types';

const MOCK_DARK_ORDERS: Partial<Order>[] = [
    { id: 'UB-1049', total: 45.00, status: 'preparing', estimatedCompletion: new Date() },
    { id: 'DD-3021', total: 22.50, status: 'pending', estimatedCompletion: new Date() },
    { id: 'GH-8821', total: 60.00, status: 'ready', estimatedCompletion: new Date() },
];

const DarkKitchen: React.FC = () => {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Package size={32} /> Dark Kitchen Ops</h2>
         <div className="flex gap-4 text-sm">
            <div className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-lg"><span className="text-green-400 font-bold">12</span> Active</div>
            <div className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-lg"><span className="text-orange-400 font-bold">4</span> Drivers Waiting</div>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">
           {/* Column 1: New Orders */}
           <div className="bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 bg-black/20 text-zinc-400 font-semibold uppercase tracking-wider">Incoming</div>
                <div className="p-4 space-y-4 overflow-auto flex-1">
                    {MOCK_DARK_ORDERS.filter(o => o.status === 'pending').map(o => (
                        <div key={o.id} className="bg-zinc-800 p-4 rounded-lg border-l-4 border-blue-500 animate-pulse">
                            <div className="flex justify-between font-bold text-white mb-2">
                                <span>{o.id}</span>
                                <span>${o.total?.toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-zinc-400">Received 2m ago</div>
                        </div>
                    ))}
                </div>
           </div>

           {/* Column 2: Cooking */}
           <div className="bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 bg-black/20 text-zinc-400 font-semibold uppercase tracking-wider">Cooking</div>
                <div className="p-4 space-y-4 overflow-auto flex-1">
                    {MOCK_DARK_ORDERS.filter(o => o.status === 'preparing').map(o => (
                         <div key={o.id} className="bg-zinc-800 p-4 rounded-lg border-l-4 border-orange-500">
                            <div className="flex justify-between font-bold text-white mb-2">
                                <span>{o.id}</span>
                                <span className="flex items-center gap-1 text-orange-400"><Clock size={14}/> 12m</span>
                            </div>
                            <div className="text-xs text-zinc-400">Grill Station • Fries</div>
                        </div>
                    ))}
                </div>
           </div>

           {/* Column 3: Ready/Dispatch */}
           <div className="bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 bg-black/20 text-zinc-400 font-semibold uppercase tracking-wider">Ready to Dispatch</div>
                <div className="p-4 space-y-4 overflow-auto flex-1">
                     {MOCK_DARK_ORDERS.filter(o => o.status === 'ready').map(o => (
                         <div key={o.id} className="bg-zinc-800 p-4 rounded-lg border-l-4 border-green-500">
                            <div className="flex justify-between font-bold text-white mb-2">
                                <span>{o.id}</span>
                                <span className="flex items-center gap-1 text-green-400"><Truck size={14}/> Driver Arrived</span>
                            </div>
                        </div>
                    ))}
                </div>
           </div>
      </div>
    </div>
  );
};

export default DarkKitchen;
