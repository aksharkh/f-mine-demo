import React, { useState } from 'react';
import { Clock, LogOut, UserCheck } from 'lucide-react';
import { type Staff, type TimeClockEntry } from '../../types';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

// Mock Staff for the dropdown if props aren't sufficient or for standalone testing
const MOCK_STAFF_LIST: Staff[] = [
    { id: '1', name: 'Chef Gordon', role: 'Head Chef', active: true, ordersCompleted: 0, start: '', status: 'online' },
    { id: '2', name: 'Waitress Sarah', role: 'Server', active: true, ordersCompleted: 0, start: '', status: 'online' },
    { id: '3', name: 'Mike (Manager)', role: 'Manager', active: true, ordersCompleted: 0, start: '', status: 'online' },
];

const StaffTimeClock: React.FC<{ staff?: Staff[] }> = ({ staff = MOCK_STAFF_LIST }) => {
  const { timeClocks } = useStore();
  const [selectedStaff, setSelectedStaff] = useState<string>('');

  const handleClockIn = () => {
    if (!selectedStaff) return;
    const staffMember = staff.find(s => s.id === selectedStaff);
    if (!staffMember) return;

    // Check if already clocked in
    const activeShift = timeClocks.find(c => c.staffId === selectedStaff && c.clockOut === 'In Progress');
    if (activeShift) {
        toast.error('Staff member already clocked in!');
        return;
    }

    const newClock: TimeClockEntry = {
        id: Date.now().toString(),
        staffId: staffMember.id,
        staffName: staffMember.name,
        clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clockOut: 'In Progress'
    };
    store.clockIn(newClock);
    setSelectedStaff('');
    toast.success(`${staffMember.name} Clocked In`);
  };

  const handleClockOut = () => {
      if (!selectedStaff) return;
      const activeShift = timeClocks.find(c => c.staffId === selectedStaff && c.clockOut === 'In Progress');
      if (!activeShift) {
          toast.error('Staff member is not clocked in!');
          return;
      }

      store.clockOut(activeShift.id, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSelectedStaff('');
      toast.success('Clocked Out');
  };

  // Sort clocks by most recent
  const sortedClocks = [...timeClocks].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
      {/* Clock In/Out Section */}
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-8 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none"></div>
            <h1 className="text-5xl font-black mb-8 text-white tabular-nums tracking-tighter shadow-black drop-shadow-lg">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            
            <div className="w-full max-w-md space-y-6 relative z-10">
                <div>
                    <label className="text-zinc-400 text-sm mb-2 block">Select Staff Member</label>
                    <select 
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-all text-lg"
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                    >
                        <option value="">-- Choose Name --</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button 
                        variant="primary" 
                        disabled={!selectedStaff} 
                        className="py-6 text-lg font-bold shadow-lg shadow-primary/20"
                        onClick={handleClockIn}
                    >
                        <UserCheck className="mr-2"/> Clock In
                    </Button>
                    <Button 
                        variant="outline" 
                        disabled={!selectedStaff} 
                        className="py-6 text-lg border-white/20 hover:bg-white/5"
                        onClick={handleClockOut}
                    >
                        <LogOut className="mr-2"/> Clock Out
                    </Button>
                </div>
                
                {selectedStaff && (
                    <div className="text-center text-sm text-zinc-500 animate-in fade-in">
                        {timeClocks.find(c => c.staffId === selectedStaff && c.clockOut === 'In Progress') 
                            ? <span className="text-green-400 font-bold">Currently Clocked In</span> 
                            : 'Currently Offline'
                        }
                    </div>
                )}
            </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock /> Recent Shit Activity</h2>
        <div className="overflow-y-auto flex-1 pr-2">
            <table className="w-full text-left">
                <thead className="text-xs text-zinc-500 uppercase border-b border-white/5 sticky top-0 bg-[#1a1a1a]">
                    <tr>
                        <th className="py-3">Staff</th>
                        <th>In</th>
                        <th>Out</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {sortedClocks.map(clock => (
                        <tr key={clock.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 font-medium text-white">
                                {clock.staffName}
                                <div className="text-[10px] text-zinc-500">ID: {clock.staffId}</div>
                            </td>
                            <td className="py-4 text-green-400 font-mono">{clock.clockIn}</td>
                            <td className="py-4 text-zinc-400 font-mono">{clock.clockOut === 'In Progress' ? '-' : clock.clockOut}</td>
                            <td className="py-4">
                                {clock.clockOut === 'In Progress' 
                                    ? <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs animate-pulse">Active</span>
                                    : <span className="text-zinc-500 text-xs">Completed</span>
                                }
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

export default StaffTimeClock;
