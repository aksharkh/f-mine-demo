import React, { useState } from 'react';
import { Crown, Printer, Ban, Timer, Play, Bike } from 'lucide-react';
import { type Order, type MenuItem } from '../../types';
import Button from '../ui/Button';

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: any, prepTime?: number | null, voidReason?: string | null) => void;
  onViewReceipt: (order: Order) => void;
  onShowRecipe: (item: MenuItem) => void;
  onQuickStockOut: (itemId: string) => void;
}

const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ 
  order, 
  onUpdateStatus,
  onViewReceipt,
  onShowRecipe,
  onQuickStockOut
}) => {
  const [prepTime, setPrepTime] = useState(15);
  const [voidReason, setVoidReason] = useState("");
  const [showVoidUI, setShowVoidUI] = useState(false);

  const createdAt = order.createdAt instanceof Date
    ? order.createdAt
    : (order.createdAt as any)?.toDate
      ? (order.createdAt as any).toDate()
      : new Date();

  const timeElapsed = (new Date().getTime() - createdAt.getTime()) / 60000;

  let borderColor = 'border-white/10';
  if (order.isPriority) borderColor = 'border-yellow-500 shadow-yellow-500/20';
  else if (timeElapsed > 30) borderColor = 'border-red-500 shadow-red-500/20 animate-pulse';
  else if (order.status === 'ready') borderColor = 'border-green-500 shadow-green-500/20';

  return (
    <div className={`flex flex-col h-full bg-[#161616] border ${borderColor} rounded-xl overflow-hidden shadow-xl transition-all hover:border-white/20 group relative`}>
      
      {/* delivery badge */}
      {order.delivery && (
         <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl z-10 flex items-center gap-1">
            <Bike size={12}/> DELIVERY
         </div>
      )}
      
      {order.scheduledTime && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-lg">
          SCHEDULED: {order.scheduledTime}
        </div>
      )}

      <div className="p-4 border-b border-white/10 flex justify-between items-start bg-white/5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Table {order.tableId}
            {order.isPriority && <Crown size={16} className="text-yellow-500 fill-current animate-bounce" />}
          </h3>
          <p className="text-white/40 text-xs font-mono mt-1">
            #{order.id.slice(0, 4)} • {createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
            <span className={`ml-2 ${timeElapsed > 20 ? 'text-red-500 font-bold' : ''}`}>({timeElapsed.toFixed(0)}m)</span>
          </p>
        </div>
        <div className="px-3 py-1 bg-black/40 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider text-white/60">
          {order.status}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {order.items.map((item: any, i: number) => (
          <div key={i} className="group/item relative">
            <div className="flex justify-between items-start text-sm">
              <span className={`font-medium ${order.status === 'served' ? 'text-white/40 line-through' : 'text-white'}`}>
                <span className="text-[#d94e28] font-bold mr-1">{item.quantity}x</span> {item.name}
              </span>
              <button 
                onClick={() => onShowRecipe(item)}
                className="opacity-0 group-hover/item:opacity-100 text-[10px] bg-white/10 px-2 py-0.5 rounded text-white hover:bg-white/20 transition-all"
              >
                RECIPE
              </button>
            </div>
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <div className="pl-6 text-xs text-white/40 mt-1 space-y-0.5">
                {item.selectedOptions.map((opt: any) => <div key={opt.name}>+ {opt.name}</div>)}
              </div>
            )}
            {item.notes && <div className="pl-6 text-xs text-yellow-500/80 italic mt-1">Note: "{item.notes}"</div>}
            
            {/* Quick Actions overlay */}
            <div className="absolute right-0 top-0 opacity-0 group-hover/item:opacity-100 flex gap-1 transition-opacity bg-[#161616]">
                <button onClick={() => onQuickStockOut(item.id)} className="text-[10px] text-red-400 border border-red-500/30 px-1 rounded hover:bg-red-500/10">OUT</button>
            </div>
          </div>
        ))}
      </div>

      {showVoidUI ? (
        <div className="p-4 bg-red-900/20 border-t border-red-500/30 animate-in slide-in-from-bottom">
           <p className="text-xs font-bold text-red-500 mb-2 uppercase">Reason for Void/Cancel?</p>
           <div className="flex flex-wrap gap-2 mb-3">
             {['86 Item', 'Cust Changed Mind', 'Mistake', 'Refire'].map(r => (
               <button key={r} onClick={() => setVoidReason(r)} className={`text-[10px] px-2 py-1 rounded border ${voidReason === r ? 'bg-red-500 text-white border-red-500' : 'border-red-500/30 text-red-400'}`}>{r}</button>
             ))}
           </div>
           <div className="flex gap-2">
             <Button onClick={() => onUpdateStatus(order.id, 'cancelled', null, voidReason)} className="flex-1 bg-red-600 h-8 text-xs">CONFIRM VOID</Button>
             <Button onClick={() => setShowVoidUI(false)} className="bg-transparent border border-white/20 h-8 text-xs">CANCEL</Button>
           </div>
        </div>
      ) : (
        <div className="p-4 border-t border-white/10 bg-white/5">
            {order.status === 'pending' && (
            <div className="flex gap-2 mb-2">
                <input 
                type="number" 
                value={prepTime} 
                onChange={(e) => setPrepTime(Number(e.target.value))} 
                className="w-16 bg-black/40 border border-white/10 rounded-lg text-center text-sm font-bold"
                />
                <Button onClick={() => onUpdateStatus(order.id, 'preparing', prepTime)} className="flex-1 bg-blue-600 hover:bg-blue-500 h-10 text-sm gap-2">
                <Timer size={16} /> ACCEPT ({prepTime}m)
                </Button>
            </div>
            )}
            
            <div className="flex gap-2">
            {order.status === 'preparing' && (
                <Button onClick={() => onUpdateStatus(order.id, 'ready')} className="flex-1 bg-[#d94e28] hover:bg-[#b03e20] h-10 text-sm gap-2 animate-pulse">
                <Play size={16} fill="currentColor" /> READY
                </Button>
            )}
            {order.status === 'ready' && (
                <Button onClick={() => onUpdateStatus(order.id, 'served')} className="flex-1 bg-green-600 hover:bg-green-500 h-10 text-sm gap-2">
                SERVED
                </Button>
            )}
            
            <div className="flex gap-1">
                <button onClick={() => onViewReceipt(order)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors" title="Print Ticket"><Printer size={18} /></button>
                <button onClick={() => setShowVoidUI(true)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500/60 hover:text-red-500 transition-colors" title="Void Order"><Ban size={18} /></button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default KitchenOrderCard;
