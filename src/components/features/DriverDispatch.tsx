import React, { useState } from 'react';
import { Truck, MapPin, User, Navigation } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const DriverDispatch: React.FC = () => {
  const { drivers, deliveryOrders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const activeDeliveries = deliveryOrders.filter(o => o.status !== 'picked_up');

  const assignDriver = (driverId: string) => {
      if (!selectedOrder) {
          toast.error('Select an order first');
          return;
      }
      store.assignDriverToOrder(driverId, selectedOrder);
      // Also update order status or metadata if we had a dedicated action, 
      // but assignDriverToOrder updates driver state.
      // We can interpret "busy" drivers with active orders in future logic.
      toast.success('Driver Assigned & Dispatched');
      setSelectedOrder(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      {/* Drivers List */}
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Truck size={24} /> Fleet Status
        </h2>
        <div className="space-y-4 flex-1 overflow-y-auto">
          {drivers.map(driver => (
            <div key={driver.id} className={`p-4 rounded-xl border transition-all ${driver.variable === 'busy' ? 'bg-orange-900/10 border-orange-500/30' : 'bg-[#222] border-white/5'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User size={20} className="text-zinc-400"/>
                    </div>
                    <div>
                        <div className="font-bold text-white">{driver.name}</div>
                        <div className="text-xs text-zinc-500">ID: #{driver.id}</div>
                    </div>
                </div>
                <div className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                  driver.variable === 'available' ? 'bg-green-500 text-black' :
                  driver.variable === 'busy' ? 'bg-orange-500 text-black' :
                  'bg-zinc-700 text-zinc-400'
                }`}>
                  {driver.variable}
                </div>
              </div>
              
              {driver.activeOrders.length > 0 && (
                  <div className="bg-black/40 rounded p-2 mb-3 text-xs text-zinc-300">
                      <div className="text-zinc-500 mb-1">Active Deliveries:</div>
                      {driver.activeOrders.map(id => <span key={id} className="inline-block bg-zinc-700 px-1 rounded mr-1">{id}</span>)}
                  </div>
              )}

              <Button 
                variant="outline" 
                disabled={driver.variable !== 'available' || !selectedOrder} 
                className={`w-full text-xs ${driver.variable === 'available' && selectedOrder ? 'bg-green-600 border-green-500 text-white hover:bg-green-500' : 'opacity-50'}`}
                onClick={() => assignDriver(driver.id)}
              >
                {driver.variable === 'available' ? (selectedOrder ? 'Assign Selected Order' : 'Select Order First') : 'Unavailable'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Map Content */}
      <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col overflow-hidden relative">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-zinc-900">
            <div className="w-full h-full opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Neighborhood_Map_10021.jpg')] bg-cover bg-center grayscale mix-blend-overlay"></div>
            {/* Animated Dots */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-ping"></div>
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
            
            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316] animate-ping delay-700"></div>
            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"></div>
        </div>

        <div className="relative z-10 p-6 pointer-events-none">
             <h2 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-md">
                <Navigation size={24} /> Live Dispatch Map
            </h2>
        </div>

        <div className="mt-auto relative z-10 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-12">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><MapPin size={16}/> Pending Pickups ({activeDeliveries.length})</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 pointer-events-auto custom-scrollbar">
                {activeDeliveries.map(order => (
                    <div key={order.id} 
                         onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                         className={`min-w-[250px] p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 ${selectedOrder === order.id ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-zinc-800/80 border-white/10 text-white hover:bg-zinc-700'}`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">{order.platformOrderId}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${selectedOrder === order.id ? 'bg-black/20 text-black' : 'bg-white/10 text-white'}`}>{order.platform}</span>
                        </div>
                        <div className="text-sm opacity-80 mb-2 truncate">{order.customerName}</div>
                        <div className="flex justify-between items-end border-t border-black/10 pt-2 mt-2">
                             <div className="text-xs font-mono">{order.time}</div>
                             <div className="font-bold">${order.total}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDispatch;
