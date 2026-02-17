import React from 'react';
import { DndContext, useDraggable, type DragEndEvent } from '@dnd-kit/core';
import { type Table } from '../../types';
import { Users, Armchair } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import { toast } from 'react-hot-toast';

// Draggable Table Component
const DraggableTable = ({ table }: { table: Table }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: table.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const toggleStatus = () => {
      const nextStatus: Record<string, Table['status']> = {
          'free': 'occupied',
          'occupied': 'dirty',
          'dirty': 'free',
          'reserved': 'occupied'
      };
      store.updateTable(table.id, { status: nextStatus[table.status] });
      toast.success(`Table ${table.name} is now ${nextStatus[table.status]}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, left: table.x, top: table.y }}
      {...listeners}
      {...attributes}
      onDoubleClick={toggleStatus}
      className={`absolute flex flex-col items-center justify-center border-2 shadow-lg transition-all cursor-move hover:scale-105 active:scale-95
        ${table.shape === 'round' ? 'rounded-full' : 'rounded-lg'}
        ${table.status === 'free' ? 'bg-green-500/20 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
        ${table.status === 'occupied' ? 'bg-red-500/20 border-red-500 text-red-100' : ''}
        ${table.status === 'reserved' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-100' : ''}
        ${table.status === 'dirty' ? 'bg-gray-500/20 border-gray-500 text-gray-100 animate-pulse' : ''}
      `}
    >
      <div className={`flex items-center justify-center font-bold ${table.shape === 'round' ? 'w-24 h-24' : 'w-32 h-24'}`}>
        <div className="text-center pointer-events-none">
            <div className="text-xl font-black drop-shadow-md">{table.name}</div>
            <div className="flex items-center gap-1 text-xs opacity-80 justify-center font-mono bg-black/20 px-2 py-0.5 rounded-full mt-1">
                <Users size={10} /> {table.seats}
            </div>
        </div>
      </div>
      {/* Chair Visuals */}
      <div className="absolute -bottom-5 opacity-50"><Armchair size={20} className="text-white" /></div>
      {table.shape === 'rect' && <div className="absolute -top-5 opacity-50"><Armchair size={20} className="text-white rotate-180" /></div>}
    </div>
  );
};

import { useState } from 'react'; // Ensure React import
import SplitBillModal from '../modals/SplitBillModal';

// ... (DraggableTable remains mostly same, change doubleClick to onClick)

const FloorPlan: React.FC = () => {
    const { tables, kitchenOrders } = useStore();
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [showPayment, setShowPayment] = useState(false);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const table = tables.find(t => t.id === active.id);
        if (table) {
            store.updateTable(table.id, {
                x: table.x + delta.x,
                y: table.y + delta.y
            });
        }
    };

    const handleTableClick = (table: Table) => {
        setSelectedTable(table);
    };

    const calculateTableTotal = (tableId: string) => {
        return kitchenOrders
            .filter(o => o.tableId === tableId && o.status !== 'served')
            .reduce((acc, o) => acc + o.total, 0);
    };

    const handlePaymentComplete = () => {
        setShowPayment(false);
        if (selectedTable) {
             store.updateTable(selectedTable.id, { status: 'dirty' });
             // Also close orders for this table? For now just UI update.
             setSelectedTable(null);
             toast.success(`Table ${selectedTable.name} Paid & Closed`);
        }
    };

  return (
    <div className="h-full w-full bg-[#1a1a1a] p-8 overflow-hidden relative rounded-xl border border-white/10 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-serif">Floor Plan Manager</h2>
        <div className="text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            Double-click to move • Click for details
        </div>
      </div>
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="relative w-full flex-1 bg-[#121212] rounded-xl border border-white/5 border-dashed overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            {tables.map(table => (
                <div key={table.id} onDoubleClick={() => {}} onClick={() => handleTableClick(table)}> {/* Wrapper for click handling */}
                    <DraggableTable table={table} />
                </div>
            ))}
        </div>
      </DndContext>

      {/* Table Details Modal */}
      {selectedTable && !showPayment && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedTable(null)}>
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 w-full max-w-sm space-y-4 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="text-2xl font-bold text-white">{selectedTable.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedTable.status === 'free' ? 'bg-green-500/20 text-green-500' : selectedTable.status === 'occupied' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{selectedTable.status}</span>
                  </div>
                  
                  <div className="space-y-2">
                       <div className="flex justify-between text-zinc-400 text-sm">
                           <span>Active Orders</span>
                           <span className="text-white">{kitchenOrders.filter(o => o.tableId === selectedTable.id).length}</span>
                       </div>
                       <div className="flex justify-between text-zinc-400 text-sm">
                           <span>Total Bill</span>
                           <span className="text-green-400 font-mono font-bold">${calculateTableTotal(selectedTable.id).toFixed(2)}</span>
                       </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4">
                      <button onClick={() => { store.updateTable(selectedTable.id, { status: 'occupied' }); setSelectedTable(null); }} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">Occupy</button>
                      <button onClick={() => { store.updateTable(selectedTable.id, { status: 'free' }); setSelectedTable(null); }} className="p-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">Free</button>
                      <button onClick={() => { store.updateTable(selectedTable.id, { status: 'dirty' }); setSelectedTable(null); }} className="p-2 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30">Dirty</button>
                      <button onClick={() => setShowPayment(true)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500 shadow-lg col-span-2 mt-2 font-bold">Pay Bill</button>
                  </div>
              </div>
          </div>
      )}

      {showPayment && selectedTable && (
          <SplitBillModal 
              total={calculateTableTotal(selectedTable.id) || 45.00} // Fallback for demo if 0
              onClose={() => setShowPayment(false)} 
              onPay={handlePaymentComplete} 
          />
      )}

      <div className="mt-6 flex gap-6 justify-center bg-black/20 p-4 rounded-xl border border-white/5">
         {/* Legend... (keep existing) */}
         <div className="flex items-center gap-2 text-sm text-white/80 font-medium"><div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_green]"></div> Free</div>
         <div className="flex items-center gap-2 text-sm text-white/80 font-medium"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]"></div> Occupied</div>
         <div className="flex items-center gap-2 text-sm text-white/80 font-medium"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_yellow]"></div> Reserved</div>
         <div className="flex items-center gap-2 text-sm text-white/80 font-medium"><div className="w-3 h-3 rounded-full bg-gray-500"></div> Dirty</div>
      </div>
    </div>
  );
};

export default FloorPlan;
