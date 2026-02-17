import React, { useState } from 'react';
import { ShoppingCart, FileText, Send, Plus } from 'lucide-react';
import { type PurchaseOrder } from '../../types';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const MOCK_POS: PurchaseOrder[] = [
  { id: 'PO-1023', supplier: 'Sysco Foods', status: 'draft', date: '2024-03-16', total: 450.00, items: [{name: 'Flour', quantity: 10, unitCost: 15}] },
  { id: 'PO-1022', supplier: 'Fresh Veg Co', status: 'ordered', date: '2024-03-15', total: 120.50, items: [] },
];

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_POS);
  const [showCreate, setShowCreate] = useState(false);

  const createPO = () => {
      const newPO: PurchaseOrder = {
          id: `PO-${Math.floor(Math.random() * 10000)}`,
          supplier: 'New Supplier',
          status: 'draft',
          date: new Date().toISOString().split('T')[0],
          total: 0,
          items: []
      };
      setOrders([newPO, ...orders]);
      setShowCreate(false);
      toast.success('Draft PO Created');
  };

  const sendOrder = (id: string) => {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'ordered' } : o));
      toast.success(`Purchase Order ${id} Sent!`, { icon: '📧' });
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingCart /> Supplier Orders</h2>
         <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-2"/> Create PO</Button>
      </div>

      {showCreate && (
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mb-6 flex flex-col items-center justify-center text-center space-y-4">
              <h3 className="text-white font-bold text-lg">Create New Purchase Order</h3>
              <p className="text-zinc-400 text-sm max-w-md">Start a new draft order for replenishment. You can add items after creating the draft.</p>
              <div className="flex gap-4">
                  <Button onClick={createPO}>Confirm Create</Button>
                  <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(po => (
            <div key={po.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 flex flex-col justify-between hover:border-white/30 transition group">
                <div>
                   <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">{po.supplier}</h3>
                            <p className="text-sm text-zinc-500 font-mono">{po.id}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider ${
                            po.status === 'draft' ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30' :
                            po.status === 'ordered' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>{po.status}</span>
                   </div>
                   <div className="text-3xl font-black text-white mb-1">${po.total.toFixed(2)}</div>
                   <p className="text-xs text-zinc-400 mb-6 flex items-center gap-1"><FileText size={12}/> {po.date}</p>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-sm bg-white/5 border-white/10 hover:bg-white/10">View Details</Button>
                    {po.status === 'draft' && (
                        <Button onClick={() => sendOrder(po.id)} className="flex-1 text-sm bg-blue-600 hover:bg-blue-500 border-none">
                            <Send size={14} className="mr-1"/> Send
                        </Button>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrders;
