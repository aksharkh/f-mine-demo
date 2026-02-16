import React, { useMemo } from 'react';
import { CheckSquare, ChefHat } from 'lucide-react';
import { type Order } from '../../types';
import Button from '../ui/Button';

interface KitchenPassProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: any) => void;
}

const KitchenPass: React.FC<KitchenPassProps> = ({ orders, onUpdateStatus }) => {
  // const [expandedTable, setExpandedTable] = useState<string | null>(null);

  // Group by table
  const ordersByTable = useMemo(() => {
    const grouped: Record<string, Order[]> = {};
    orders.forEach(o => {
      if (o.status === 'preparing') {
        if (!grouped[o.tableId]) grouped[o.tableId] = [];
        grouped[o.tableId].push(o);
      }
    });
    return grouped;
  }, [orders]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
       {Object.entries(ordersByTable).map(([tableId, tableOrders]) => (
         <div key={tableId} className="bg-[#1a1a1a] border border-white/20 rounded-xl overflow-hidden flex flex-col h-96">
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
               <h3 className="text-2xl font-serif font-bold">Table {tableId}</h3>
               <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{tableOrders.length} Tickets</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {tableOrders.map(order => (
                 <div key={order.id} className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group cursor-pointer">
                         <div className="w-5 h-5 border border-white/30 rounded flex items-center justify-center group-hover:border-[#d94e28] group-hover:text-[#d94e28]"><CheckSquare size={14}/></div>
                         <div className="flex-1">
                            <div className="text-sm font-bold flex justify-between">
                               <span>{item.quantity}x {item.name}</span>
                               <span className="text-[10px] uppercase bg-white/10 px-1 rounded">{item.course || 'main'}</span>
                            </div>
                            {item.notes && <div className="text-xs text-orange-400 italic">{item.notes}</div>}
                         </div>
                      </div>
                    ))}
                    <div className="h-px bg-white/10 my-2" />
                 </div>
               ))}
            </div>
            <div className="p-4 border-t border-white/10">
               <Button onClick={() => tableOrders.forEach(o => onUpdateStatus(o.id, 'ready'))} className="w-full bg-green-600 hover:bg-green-500 shadow-none">Serve All Tickets</Button>
            </div>
         </div>
       ))}
       {Object.keys(ordersByTable).length === 0 && (
         <div className="col-span-full h-96 flex flex-col items-center justify-center text-white/30 border-2 border-dashed border-white/10 rounded-xl">
            <ChefHat size={48} className="mb-4"/>
            <p>No active orders at The Pass</p>
         </div>
       )}
    </div>
  );
};

export default KitchenPass;
