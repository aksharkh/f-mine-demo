import React, { useState } from 'react';
import { Thermometer, Check, AlertTriangle, Plus, X } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const TemperatureLog: React.FC = () => {
  const { tempLogs } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState({ unit: '', temp: '', note: '' });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const tempVal = parseFloat(newLog.temp);
      store.addTempLog({
          id: Math.random().toString(36).substr(2, 5),
          unitName: newLog.unit,
          temperature: tempVal,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          checkedBy: 'Admin', // In real app, current user
          status: tempVal > 5 && tempVal < 60 ? 'warning' : 'ok' // Simple Danger Zone Check
      });
      setShowForm(false);
      setNewLog({ unit: '', temp: '', note: '' });
      toast.success('Temperature Logged');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Thermometer /> Cold Storage Logs</h2>
         <Button onClick={() => setShowForm(!showForm)} className={showForm ? "bg-red-500 hover:bg-red-600" : ""}>
             {showForm ? <X size={20}/> : <Plus size={20} className="mr-2"/>}
             {showForm ? "Cancel" : "New Entry"}
         </Button>
      </div>

      {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-4">
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">Unit Name</label>
                   <select 
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                        required
                        value={newLog.unit}
                        onChange={e => setNewLog({...newLog, unit: e.target.value})}
                   >
                       <option value="">Select Unit...</option>
                       <option value="Walk-in Fridge 1">Walk-in Fridge 1</option>
                       <option value="Freezer A">Freezer A</option>
                       <option value="Line Fridge">Line Fridge</option>
                       <option value="Dessert Chiller">Dessert Chiller</option>
                   </select>
               </div>
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">Temperature (°C)</label>
                   <input 
                        type="number"
                        step="0.1"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                        required
                        placeholder="e.g. 3.5"
                        value={newLog.temp}
                        onChange={e => setNewLog({...newLog, temp: e.target.value})}
                   />
               </div>
               <div>
                   <label className="text-xs text-zinc-400 mb-1 block">Notes (Optional)</label>
                   <input 
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="Restocked, etc."
                        value={newLog.note}
                        onChange={e => setNewLog({...newLog, note: e.target.value})}
                   />
               </div>
               <Button type="submit" variant="primary">Save Entry</Button>
          </form>
      )}

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-black/40 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <tr>
                    <th className="p-4">Unit Name</th>
                    <th className="p-4">Temperature</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Checked By</th>
                    <th className="p-4">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {tempLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">{log.unitName}</td>
                        <td className="p-4 text-white font-mono text-lg flex items-center gap-2">
                             <div className={`w-2 h-8 rounded-full ${
                                 log.temperature < 0 ? 'bg-blue-500' : 
                                 log.temperature < 5 ? 'bg-green-500' : 
                                 'bg-red-500'
                             }`}></div>
                            {log.temperature}°C
                        </td>
                        <td className="p-4 text-zinc-400">{log.timestamp}</td>
                        <td className="p-4 text-zinc-400 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-white">
                                {log.checkedBy.charAt(0)}
                            </div>
                            {log.checkedBy}
                        </td>
                        <td className="p-4">
                            {log.status === 'ok' && <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-green-500/20"><Check size={14}/> NORMAL</span>}
                            {(log.status === 'warning' || log.status === 'critical') && <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-red-500/20 animate-pulse"><AlertTriangle size={14}/> ALERT</span>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default TemperatureLog;
