import React, { useState } from 'react';
import { Wrench, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const MaintenanceLogView: React.FC = () => {
  const { maintenanceLogs } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ equipment: '', issue: '', priority: 'medium' as const });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      store.addMaintenanceLog({
          id: Math.random().toString(36).substr(2, 9),
          equipment: newIssue.equipment,
          issue: newIssue.issue,
          priority: newIssue.priority,
          status: 'reported',
          reportedDate: new Date().toISOString().split('T')[0],
          cost: 0
      });
      setShowForm(false);
      setNewIssue({ equipment: '', issue: '', priority: 'medium' });
      toast.success('Maintenance Report Submitted');
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Wrench /> Equipment Maintenance</h2>
         <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2"/> Report Issue</Button>
      </div>

      {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 mb-6 space-y-4">
              <input 
                placeholder="Equipment Name" 
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                required
                value={newIssue.equipment}
                onChange={e => setNewIssue({...newIssue, equipment: e.target.value})}
              />
              <input 
                placeholder="Issue Description" 
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                required
                value={newIssue.issue}
                onChange={e => setNewIssue({...newIssue, issue: e.target.value})}
              />
              <select 
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                value={newIssue.priority}
                onChange={e => setNewIssue({...newIssue, priority: e.target.value as any})}
              >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
              </select>
              <Button type="submit" className="w-full">Submit Report</Button>
          </form>
      )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {maintenanceLogs.map(log => (
               <div key={log.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 flex flex-col justify-between">
                   <div>
                       <div className="flex justify-between items-start mb-2">
                           <h3 className="text-white font-bold">{log.equipment}</h3>
                           <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                               log.priority === 'high' ? 'bg-red-500/20 text-red-400' : 
                               log.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                               'bg-blue-500/20 text-blue-400'
                           }`}>
                               {log.priority}
                           </span>
                       </div>
                       <p className="text-zinc-400 text-sm mb-4">{log.issue}</p>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-white/10">
                       <button 
                         onClick={() => {
                             if(log.status !== 'fixed') {
                                 store.updateMaintenanceStatus(log.id, 'fixed');
                                 toast.success('Marked as Fixed');
                             }
                         }}
                         className={`flex items-center gap-2 text-sm font-bold transition hover:opacity-80 ${log.status === 'fixed' ? 'text-green-400 cursor-default' : 'text-blue-400 cursor-pointer'}`}
                       >
                           {log.status === 'fixed' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                           {log.status.replace('-', ' ')}
                       </button>
                       <span className="text-zinc-500 text-xs">{log.reportedDate}</span>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default MaintenanceLogView;
