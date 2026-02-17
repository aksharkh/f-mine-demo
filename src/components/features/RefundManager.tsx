import React from 'react';
import { RefreshCcw, Check, X } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const RefundManager: React.FC = () => {
  const { refundRequests } = useStore();

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
      store.updateRefundStatus(id, status);
      toast.success(`Refund ${status === 'approved' ? 'Approved' : 'Rejected'}`);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><RefreshCcw /> Refund Manager</h2>
      </div>

       <div className="space-y-4">
           {refundRequests.map(req => (
               <div key={req.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-bold text-lg">{req.orderId}</span>
                            <span className="text-green-400 font-bold">${req.amount.toFixed(2)}</span>
                       </div>
                       <div className="text-zinc-400 text-sm">Reason: <span className="text-white">{req.reason}</span></div>
                       <div className="text-zinc-500 text-xs mt-1">Requested by {req.requestedBy} • {req.date}</div>
                   </div>
                   
                   {/* ... (keep rest of JSX same) */}
                   {req.status === 'pending' ? (
                       <div className="flex gap-2">
                           <Button onClick={() => handleAction(req.id, 'rejected')} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30"><X size={18}/></Button>
                           <Button onClick={() => handleAction(req.id, 'approved')} className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/30"><Check size={18}/></Button>
                       </div>
                   ) : (
                       <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${req.status === 'approved' ? 'text-green-400 border border-green-500/30' : 'text-red-400 border border-red-500/30'}`}>
                           {req.status}
                       </span>
                   )}
               </div>
           ))}
       </div>
    </div>
  );
};

export default RefundManager;
