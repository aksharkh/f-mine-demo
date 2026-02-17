import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search, Plus, User } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const ReservationCalendar: React.FC = () => {
  const { reservations } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newRes, setNewRes] = useState({ name: '', time: '18:00', size: 2, table: 'T1' });

  const handleCreate = () => {
      if (!newRes.name) return;
      store.addReservation({
          id: Math.random().toString(36).substr(2, 5),
          userId: 'guest',
          name: newRes.name,
          time: newRes.time,
          partySize: newRes.size,
          tableId: newRes.table,
          createdAt: new Date() as any
      });
      toast.success('Reservation Confirmed');
      setShowModal(false);
      setNewRes({ name: '', time: '18:00', size: 2, table: 'T1' });
  };

  const getPosFromTime = (time: string) => {
      // Simple logic: 17:00 is 0%, 22:00 is 100%
      const [h, m] = time.split(':').map(Number);
      const totalMin = (h * 60) + m;
      const startMin = 17 * 60;
      const endMin = 23 * 60;
      const percent = ((totalMin - startMin) / (endMin - startMin)) * 100;
      return Math.max(0, Math.min(100, percent));
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white font-serif">Reservations</h2>
        <div className="flex gap-4">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/>
                <input type="text" placeholder="Search..." className="bg-[#1a1a1a] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:border-[#d94e28] outline-none" />
            </div>
            <Button onClick={() => setShowModal(true)} className="gap-2"><Plus size={16}/> New Booking</Button>
        </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 w-full max-w-md space-y-4 shadow-2xl">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><CalendarIcon size={20}/> New Reservation</h3>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="text-xs text-zinc-400 block mb-1">Guest Name</label>
                          <input className="w-full bg-black border border-white/10 rounded p-2 text-white" 
                             value={newRes.name} onChange={e => setNewRes({...newRes, name: e.target.value})} autoFocus/>
                      </div>
                      <div className="flex gap-4">
                          <div className="flex-1">
                              <label className="text-xs text-zinc-400 block mb-1">Time</label>
                              <input type="time" className="w-full bg-black border border-white/10 rounded p-2 text-white" 
                                 value={newRes.time} onChange={e => setNewRes({...newRes, time: e.target.value})}/>
                          </div>
                          <div className="flex-1">
                              <label className="text-xs text-zinc-400 block mb-1">Size</label>
                              <input type="number" className="w-full bg-black border border-white/10 rounded p-2 text-white" 
                                 value={newRes.size} onChange={e => setNewRes({...newRes, size: Number(e.target.value)})}/>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs text-zinc-400 block mb-1">Table</label>
                          <select className="w-full bg-black border border-white/10 rounded p-2 text-white"
                             value={newRes.table} onChange={e => setNewRes({...newRes, table: e.target.value})}>
                              <option value="T1">Table 1 (4p)</option>
                              <option value="T2">Table 2 (4p)</option>
                              <option value="T3">Table 3 (6p)</option>
                              <option value="T4">Table 4 (2p)</option>
                              <option value="VIP">VIP (8p)</option>
                          </select>
                      </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                       <Button onClick={handleCreate} className="flex-1">Confirm Booking</Button>
                       <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  </div>
              </div>
          </div>
      )}

       {/* Timeline Visualization */}
       <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-x-auto shadow-inner">
           <div className="min-w-[800px]">
               {/* Time Header */}
               <div className="flex border-b border-white/10 bg-black/20">
                   <div className="w-24 p-4 text-xs font-bold text-white/40 uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1a1a] z-20">Table</div>
                   {[17, 18, 19, 20, 21, 22].map(hour => (
                       <div key={hour} className="flex-1 p-4 border-r border-white/5 text-center text-white/60 text-sm font-mono relative">
                           {hour}:00
                           <div className="absolute top-full left-0 bottom-[-500px] w-px bg-white/5 z-0 pointer-events-none"></div>
                       </div>
                   ))}
               </div>

               {/* Table Rows */}
               {['T1', 'T2', 'T3', 'T4', 'VIP'].map((table) => (
                   <div key={table} className="flex border-b border-white/5 hover:bg-white/[0.02] transition-colors h-20 items-center">
                       <div className="w-24 p-4 text-sm font-bold text-white border-r border-white/10 sticky left-0 bg-[#1a1a1a] z-10 flex items-center justify-between">
                           {table}
                           <small className="text-xs text-white/20 font-normal">4p</small>
                       </div>
                       <div className="flex-1 relative h-full w-full">
                           {/* Render bookings */}
                           {reservations.filter(r => r.tableId?.toLowerCase() === table.toLowerCase()).map(res => {
                               const left = getPosFromTime(res.time);
                               return (
                                   <div key={res.id} 
                                        className="absolute top-2 bottom-2 bg-gradient-to-r from-[#d94e28] to-[#ff6b4a] rounded-lg px-3 py-1 text-xs text-white border border-white/20 shadow-lg flex flex-col justify-center cursor-pointer hover:scale-105 transition-transform z-10" 
                                        style={{ left: `${left}%`, width: '15%' }}> 
                                       <div className="font-bold truncate text-white">{res.name}</div>
                                       <div className="opacity-90 text-[10px] flex items-center gap-1 font-mono text-white/80"><User size={8}/> {res.partySize}p • {res.time}</div>
                                   </div>
                               );
                           })}
                       </div>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
};

export default ReservationCalendar;
