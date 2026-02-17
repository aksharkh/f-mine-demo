import React, { useEffect, useState } from 'react';
import { Bike, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const DeliveryAggregator: React.FC = () => {
  const { deliveryOrders } = useStore();
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation Logic
  useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (isSimulating) {
          interval = setInterval(() => {
              const platforms = ['UberEats', 'DoorDash', 'GrubHub'];
              const names = ['Tom H.', 'Sarah L.', 'Mike P.', 'Emily R.', 'Jessica W.'];
              const items = [['Pizza'], ['Burger', 'Fries'], ['Sushi Set'], ['Pasta', 'Salad'], ['Tacos']];
              
              store.addDeliveryOrder({
                  id: Math.random().toString(36).substr(2, 5),
                  platform: platforms[Math.floor(Math.random() * platforms.length)] as any,
                  platformOrderId: `#${Math.floor(Math.random() * 10000)}`,
                  customerName: names[Math.floor(Math.random() * names.length)],
                  items: items[Math.floor(Math.random() * items.length)],
                  total: Math.floor(Math.random() * 50) + 15,
                  status: 'new',
                  time: 'Just now'
              });
              toast('New Order!', { icon: '🔔', duration: 2000 });
          }, 5000); // Faster simulation for demo
      }
      return () => clearInterval(interval);
  }, [isSimulating]);

  const advanceOrder = (id: string, currentStatus: string) => {
      const nextStatus = currentStatus === 'new' ? 'cooking' : currentStatus === 'cooking' ? 'ready' : 'picked_up';
      
      if (currentStatus === 'picked_up') {
          // Effectively Archive
          // For this demo, we can just remove it or keep it in a 'picked_up' column
           store.updateDeliveryStatus(id, 'picked_up');
           toast.success('Order Picked Up');
      } else {
          store.updateDeliveryStatus(id, nextStatus as any);
          toast.success(`Order Moved to ${nextStatus.toUpperCase()}`);
      }
  };

  const getPlatformColor = (platform: string) => {
       switch(platform) {
           case 'UberEats': return 'bg-[#06C167]/20 text-[#06C167] border-[#06C167]/30';
           case 'DoorDash': return 'bg-[#FF3008]/20 text-[#FF3008] border-[#FF3008]/30';
           case 'GrubHub': return 'bg-[#F63440]/20 text-[#F63440] border-[#F63440]/30';
           default: return 'bg-zinc-500/20 text-zinc-400';
       }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Bike /> Delivery Aggregator</h2>
         <div className="flex items-center gap-4">
             <div className="flex gap-2 text-xs">
                 <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-[#06C167]"></div> Uber</span>
                 <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-[#FF3008]"></div> DoorDash</span>
                 <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-[#F63440]"></div> GrubHub</span>
             </div>
             <Button onClick={() => setIsSimulating(!isSimulating)} className={`transition-all ${isSimulating ? "bg-red-600 hover:bg-red-500 animate-pulse" : "bg-green-600 hover:bg-green-500"}`}>
                 {isSimulating ? "Stop Simulation" : "Start Live Feed"}
             </Button>
         </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 overflow-hidden">
           {['new', 'cooking', 'ready', 'picked_up'].map(column => (
               <div key={column} className="bg-[#1a1a1a] rounded-xl flex flex-col border border-white/10 h-full overflow-hidden">
                   <div className={`p-4 border-b border-white/5 flex justify-between items-center ${
                       column === 'new' ? 'bg-blue-500/10' : 
                       column === 'cooking' ? 'bg-orange-500/10' : 
                       column === 'ready' ? 'bg-green-500/10' : 'bg-zinc-500/10'
                   }`}>
                       <h3 className="font-bold uppercase text-xs tracking-wider text-white flex items-center gap-2">
                           {column === 'new' && <AlertCircle size={14} className="text-blue-400"/>}
                           {column === 'cooking' && <Clock size={14} className="text-orange-400"/>}
                           {column === 'ready' && <CheckCircle size={14} className="text-green-400"/>}
                           {column}
                       </h3>
                       <span className="bg-black/40 px-2 py-0.5 rounded-full text-xs font-mono text-white">
                           {deliveryOrders.filter(o => o.status === column).length}
                       </span>
                   </div>
                   
                   <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                       {deliveryOrders.filter(o => o.status === column).map(order => (
                           <div key={order.id} className="bg-[#222] p-4 rounded-lg border border-white/5 shadow-lg group hover:border-white/20 transition transform hover:-translate-y-1 duration-200">
                               <div className="flex justify-between items-start mb-3">
                                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPlatformColor(order.platform)}`}>
                                       {order.platform}
                                   </span>
                                   <span className="text-zinc-500 text-[10px] font-mono">{order.time}</span>
                               </div>
                               
                               <div className="mb-3">
                                   <div className="font-bold text-white text-base leading-tight mb-1">{order.customerName}</div>
                                   <div className="text-zinc-500 text-xs font-mono">{order.platformOrderId}</div>
                               </div>

                               <div className="space-y-1 mb-4 border-l-2 border-white/10 pl-2">
                                   {order.items.map((item, i) => (
                                       <div key={i} className="text-zinc-300 text-xs truncate">
                                           {typeof item === 'string' ? item : item}
                                       </div>
                                   ))}
                               </div>
                               
                               <div className="flex justify-between items-center mt-2">
                                   <div className="text-green-400 font-bold text-sm">${order.total}</div>
                                   {column !== 'picked-up' && (
                                       <button 
                                        onClick={() => advanceOrder(order.id, order.status)} 
                                        className="text-xs py-1 px-3 bg-white/10 hover:bg-white/20 rounded text-white transition"
                                       >
                                           Next →
                                       </button>
                                   )}
                               </div>
                           </div>
                       ))}
                       {deliveryOrders.filter(o => o.status === column).length === 0 && (
                           <div className="text-center text-zinc-600 text-xs italic py-10 opacity-50">Empty Station</div>
                       )}
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default DeliveryAggregator;
