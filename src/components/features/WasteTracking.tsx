import React, { useState } from 'react';
import { Trash2, TrendingUp, Plus, X, AlertTriangle } from 'lucide-react';
import { useStore, store } from '../../lib/store';

import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const WasteTracking: React.FC = () => {
  const { wasteLogs } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState({ itemName: '', quantity: 1, reason: 'spoilage', cost: 0 });

  const totalLoss = wasteLogs.reduce((acc, curr) => acc + curr.cost, 0);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      store.addWasteLog({
          id: Math.random().toString(36).substr(2, 5),
          itemId: 'GEN-' + Math.floor(Math.random()*1000),
          itemName: newLog.itemName,
          quantity: newLog.quantity,
          reason: newLog.reason as any,
          cost: Number(newLog.cost),
          date: new Date().toLocaleDateString(),
          reportedBy: 'Admin'
      });
      setShowForm(false);
      setNewLog({ itemName: '', quantity: 1, reason: 'spoilage', cost: 0 });
      toast.success('Waste Logged');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Trash2 /> Waste Tracking</h2>
         <Button variant="outline" onClick={() => setShowForm(!showForm)} className="text-red-400 border-red-400/30 hover:bg-red-500/10 hover:border-red-500/50">
             {showForm ? <X size={18}/> : <Plus size={18} className="mr-2"/>}
             {showForm ? 'Cancel' : 'Report New Waste'}
         </Button>
      </div>

      {showForm && (
          <form onSubmit={handleSubmit} className="bg-red-900/10 p-6 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-4 mb-6">
              <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><AlertTriangle size={18}/> Log Waste Incident</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-1">
                      <label className="text-xs text-red-300/70 mb-1 block">Item Name</label>
                      <input className="w-full bg-black/30 border border-red-500/20 rounded-lg p-3 text-white focus:border-red-500 outline-none" required 
                           value={newLog.itemName} onChange={e => setNewLog({...newLog, itemName: e.target.value})} placeholder="e.g. Avocado" />
                  </div>
                  <div>
                      <label className="text-xs text-red-300/70 mb-1 block">Reason</label>
                      <select className="w-full bg-black/30 border border-red-500/20 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                           value={newLog.reason} onChange={e => setNewLog({...newLog, reason: e.target.value})}>
                          <option value="spoilage">Spoilage</option>
                          <option value="burnt">Burnt</option>
                          <option value="dropped">Dropped</option>
                          <option value="customer_return">Customer Return</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs text-red-300/70 mb-1 block">Est. Cost ($)</label>
                      <input type="number" step="0.01" className="w-full bg-black/30 border border-red-500/20 rounded-lg p-3 text-white focus:border-red-500 outline-none" required 
                           value={newLog.cost} onChange={e => setNewLog({...newLog, cost: Number(e.target.value)})} />
                  </div>
                   <div>
                       <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white border-none py-3">Submit Report</Button>
                   </div>
              </div>
          </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Stats */}
         <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10 flex flex-col justify-between shadow-lg">
            <div>
                <h3 className="text-zinc-500 font-medium mb-1 uppercase tracking-wider text-xs">Total Loss (This Month)</h3>
                <div className="text-5xl font-black text-red-500 mb-4 tracking-tighter">-${totalLoss.toFixed(2)}</div>
                <div className="flex items-center gap-2 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/10 w-fit">
                    <TrendingUp size={16} className="text-red-500" />
                    <span className="text-red-400 font-bold">+12%</span> <span className="text-zinc-500">vs last month</span>
                </div>
            </div>
            <div className="mt-10">
                 <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">Primary Waste Reasons</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Spoilage</span>
                        <div className="flex items-center gap-2">
                             <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="w-[65%] h-full bg-orange-500"></div></div>
                             <span className="text-white font-mono">65%</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Kitchen Error</span>
                        <div className="flex items-center gap-2">
                             <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="w-[25%] h-full bg-red-500"></div></div>
                             <span className="text-white font-mono">25%</span>
                        </div>
                    </div>
                 </div>
            </div>
         </div>

         {/* Log Table */}
         <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <h3 className="font-bold text-white">Recent Incidents</h3>
                <span className="text-xs text-zinc-500">{wasteLogs.length} records found</span>
            </div>
            <div className="overflow-auto flex-1">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-xs text-zinc-500 uppercase sticky top-0">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Cost</th>
                            <th className="p-4">Reported By</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {wasteLogs.map(log => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 font-medium text-white group-hover:text-red-400 transition-colors">{log.itemName} <span className="text-xs text-zinc-500 ml-1">x{log.quantity}</span></td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${
                                        log.reason === 'spoilage' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                                        log.reason === 'burnt' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                        'border-zinc-500/30 text-zinc-400'
                                    }`}>
                                        {log.reason}
                                    </span>
                                </td>
                                <td className="p-4 text-red-500 font-mono font-bold">-${log.cost.toFixed(2)}</td>
                                <td className="p-4 text-zinc-400 text-sm">{log.reportedBy}</td>
                                <td className="p-4 text-zinc-500 text-xs">{log.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WasteTracking;
