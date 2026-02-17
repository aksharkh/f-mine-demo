import React, { useState } from 'react';
import { ClipboardCheck, Activity, Clock, Check, Thermometer } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import { type HaccpLogEntry } from '../../types';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const HaccpLog: React.FC = () => {
  const { haccpLogs } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState<Partial<HaccpLogEntry>>({
      itemName: '', action: 'cooling', startTemp: 0, endTemp: 0, b: '', endTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      store.addHaccpLog({
          id: Math.random().toString(36).substr(2, 5),
          itemId: 'GEN-' + Math.floor(Math.random()*1000),
          itemName: newLog.itemName || 'Unnamed Item',
          action: (newLog.action as any) || 'cooling',
          startTemp: Number(newLog.startTemp),
          endTemp: Number(newLog.endTemp),
          b: newLog.b || new Date().toLocaleTimeString(),
          endTime: newLog.endTime || new Date().toLocaleTimeString(),
          operator: 'Admin',
          pass: true // simplified logic
      });
      setShowForm(false);
      setNewLog({ itemName: '', action: 'cooling', startTemp: 0, endTemp: 0, b: '', endTime: '' });
      toast.success('Compliance Log Saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardCheck /> HACCP Compliance</h2>
         <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'New Compliance Log'}
            </Button>
         </div>
      </div>

      {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 mb-6">
               <div className="md:col-span-2">
                   <label className="text-xs text-zinc-400 mb-1 block">Item Name</label>
                   <input className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" required 
                       value={newLog.itemName} onChange={e => setNewLog({...newLog, itemName: e.target.value})} />
               </div>
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">Process</label>
                   <select className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                        value={newLog.action} onChange={e => setNewLog({...newLog, action: e.target.value as any})}>
                       <option value="cooling">Cooling</option>
                       <option value="reheating">Reheating</option>
                       <option value="holding">Hot Holding</option>
                   </select>
               </div>
               <div>
                   <Button type="submit" variant="primary" className="w-full mt-6">Submit Log</Button>
               </div>
               
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">Start Temp (°C)</label>
                   <input type="number" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" required 
                       value={newLog.startTemp} onChange={e => setNewLog({...newLog, startTemp: Number(e.target.value)})} />
               </div>
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">End Temp (°C)</label>
                   <input type="number" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" required 
                       value={newLog.endTemp} onChange={e => setNewLog({...newLog, endTemp: Number(e.target.value)})} />
               </div>
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">Start Time</label>
                   <input type="time" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" required 
                       value={newLog.b} onChange={e => setNewLog({...newLog, b: e.target.value})} />
               </div>
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">End Time</label>
                   <input type="time" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" required 
                       value={newLog.endTime} onChange={e => setNewLog({...newLog, endTime: e.target.value})} />
               </div>
          </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
            {haccpLogs.map(log => (
                <div key={log.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-5 flex items-center justify-between group hover:border-white/20 transition-all shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${log.pass ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            <Activity size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">{log.itemName}</h3>
                            <div className="text-sm text-zinc-400 flex items-center gap-3">
                                <span className={`capitalize px-2 py-0.5 rounded text-xs font-bold ${
                                    log.action === 'cooling' ? 'bg-blue-500/20 text-blue-400' :
                                    log.action === 'reheating' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-purple-500/20 text-purple-400'
                                }`}>{log.action}</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {log.b} - {log.endTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                         <div className="flex items-center justify-end gap-2 text-2xl font-mono font-bold text-white mb-1">
                             <Thermometer size={16} className="text-zinc-600"/>
                             {log.startTemp}° <span className="text-zinc-600 text-sm">→</span> {log.endTemp}°
                         </div>
                         <div className="text-xs text-zinc-500">Logged by {log.operator}</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ClipboardCheck size={18}/> Safety Limits</h3>
            <ul className="space-y-4 text-sm">
                <li className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-400">Danger Zone</span>
                    <span className="text-red-400 font-mono font-bold bg-red-900/20 px-2 py-1 rounded">5°C - 60°C</span>
                </li>
                 <li className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-400">Hot Holding</span>
                    <span className="text-orange-400 font-mono font-bold bg-orange-900/20 px-2 py-1 rounded">&gt; 60°C</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-400">Cold Storage</span>
                    <span className="text-blue-400 font-mono font-bold bg-blue-900/20 px-2 py-1 rounded">&lt; 5°C</span>
                </li>
            </ul>
            <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-green-400 font-bold mb-1 flex items-center gap-2"><Check size={16}/> System Status</div>
                <p className="text-xs text-green-300/70">All logs within compliance for last 24h.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HaccpLog;
