import React, { useState } from 'react';
import { UserCheck, UserX, Award, Plus, BookOpen } from 'lucide-react';
import { type Staff } from '../../types';
import Button from '../ui/Button';

interface TeamManagementProps {
  staff: Staff[];
  onToggleStatus: (id: string, active: boolean) => void;
  onUpdateStaffTimes?: (id: string, start: string, end: string) => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ staff, onToggleStatus }) => {
  const [shiftNotes, setShiftNotes] = useState("");
  
  return (
    <div className="flex gap-6 h-[80vh]">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {staff.map(member => (
             <div key={member.id} className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${member.active ? 'bg-green-900/10 border-green-500/30' : 'bg-[#1a1a1a] border-white/10 opacity-60'}`}>
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${member.active ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'}`}>{member.name.charAt(0)}</div>
                      <div><h3 className="font-bold text-lg">{member.name}</h3><p className="text-xs uppercase tracking-widest opacity-60">{member.role}</p></div>
                   </div>
                   <button onClick={() => onToggleStatus(member.id, !member.active)} className={`p-3 rounded-full transition-colors ${member.active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/40' : 'bg-white/10 text-white/40 hover:text-white'}`}>{member.active ? <UserCheck size={24}/> : <UserX size={24}/>}</button>
                </div>
                <div className="bg-white/5 p-3 rounded-xl mb-4">
                   <div className="grid grid-cols-2 gap-4 text-center">
                      <div><span className="block text-xs text-white/40 uppercase">Shift Start</span><span className="font-mono">{member.start || '--:--'}</span></div>
                      <div><span className="block text-xs text-white/40 uppercase">Shift End</span><span className="font-mono">{member.end || '--:--'}</span></div>
                   </div>
                </div>
                {member.active && <p className="text-xs text-green-400 text-center"><Award size={12} className="inline mr-1"/>Orders Completed: {member.ordersCompleted || 0}</p>}
             </div>
           ))}
           <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/30 hover:border-white/30 hover:text-white cursor-pointer transition-all">
              <Plus size={32} className="mb-2"/>
              <span className="text-sm font-bold uppercase tracking-widest">Add Staff Member</span>
           </div>
        </div>
      </div>
      <div className="w-80 bg-[#161616] border border-white/10 rounded-2xl p-6 flex flex-col">
         <h3 className="text-xl font-serif mb-4 flex items-center gap-2"><BookOpen size={20}/> Shift Logbook</h3>
         <div className="flex-1 bg-white/5 rounded-xl p-4 mb-4 overflow-y-auto space-y-3">
            <div className="bg-black/30 p-3 rounded-lg text-sm"><span className="text-xs text-[#d94e28] font-bold block mb-1">Morning Shift</span>Ice machine is leaking slightly. Called maintenance.</div>
            <div className="bg-black/30 p-3 rounded-lg text-sm"><span className="text-xs text-[#d94e28] font-bold block mb-1">Manager</span>Remember to check stock of avocados for tomorrow.</div>
         </div>
         <div className="mt-auto"><textarea value={shiftNotes} onChange={(e) => setShiftNotes(e.target.value)} placeholder="Add entry..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm h-20 resize-none focus:outline-none focus:border-[#d94e28] mb-2" /><Button onClick={() => setShiftNotes("")} className="w-full">Post Entry</Button></div>
      </div>
    </div>
  );
};

export default TeamManagement;
