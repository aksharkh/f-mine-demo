import React, { useState, useEffect } from 'react';
import { Car, Clock, Plus, Key, MapPin, User } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const ValetTracker: React.FC = () => {
    const { valetTickets } = useStore();
    const [requestCount, setRequestCount] = useState(0);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const requested = valetTickets.filter(t => t.status === 'requested');
            setRequestCount(requested.length);
        }, 1000);
        return () => clearInterval(interval);
    }, [valetTickets]);

    const requestCar = (id: string) => {
        store.updateValetStatus(id, 'requested');
        toast('Guest Requested Vehicle', { icon: '🚗' });
    };

    const markRetrieved = (id: string) => {
        store.updateValetStatus(id, 'retrieved');
        toast.success('Vehicle Delivered to Guest');
    };

    const newTicket = () => {
        const id = Math.random().toString(36).substr(2, 5).toUpperCase();
        store.addValetTicket({
            id,
            ticketNumber: `V-${Math.floor(Math.random() * 900) + 100}`,
            carModel: 'New Entry (Edit)',
            plate: '---',
            ownerName: 'Guest',
            status: 'parked',
            parkedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            spot: `Lot ${['A','B','C'][Math.floor(Math.random()*3)]}-${Math.floor(Math.random() * 50) + 1}`
        });
        toast.success('Ticket Generated');
    };

    return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Car /> Valet Dashboard</h2>
         <div className="flex gap-4">
             {requestCount > 0 && <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-2"><Clock size={16}/> {requestCount} Waiting</span>}
             <Button onClick={newTicket} className="bg-white text-black hover:bg-zinc-200"><Plus size={16} className="mr-2"/> New Ticket</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valetTickets.filter(t => t.status !== 'retrieved').map(ticket => (
                <div key={ticket.id} className={`rounded-xl border p-6 transition-all duration-300 relative overflow-hidden group ${ticket.status === 'requested' ? 'bg-gradient-to-br from-red-900/40 to-black border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-[#1a1a1a] border-white/10 hover:border-white/20'}`}>
                    {ticket.status === 'requested' && <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl">REQUESTED</div>}
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-3xl font-black text-white tracking-tighter">{ticket.ticketNumber}</div>
                        <div className="text-zinc-500 text-xs font-mono bg-white/5 px-2 py-1 rounded border border-white/5">{ticket.id}</div>
                    </div>
                    
                    <div className="space-y-3 mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-zinc-500"/>
                            <span className="text-white font-bold text-lg">{ticket.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Car size={16} className="text-zinc-500"/>
                            <span className="text-zinc-300">{ticket.carModel}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border border-zinc-500 flex items-center justify-center text-[8px] rounded-sm text-zinc-500 font-mono">123</div>
                            <span className="text-white font-mono bg-zinc-800 px-2 rounded border border-zinc-700">{ticket.plate}</span>
                        </div>
                        <div className="flex items-center gap-3 text-orange-400">
                            <MapPin size={16}/>
                            <span className="font-bold">{ticket.spot}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                            <Clock size={12}/> In: {ticket.parkedTime}
                        </div>
                        {ticket.status === 'parked' ? (
                            <Button onClick={() => requestCar(ticket.id)} className="bg-blue-600 hover:bg-blue-500 text-xs h-8">Request Car</Button>
                        ) : (
                            <Button onClick={() => markRetrieved(ticket.id)} className="bg-green-600 hover:bg-green-500 text-xs h-8 w-full">
                                <Key size={12} className="mr-2"/> Mark Delivered
                            </Button>
                        )}
                    </div>
                </div>
            ))}
      </div>
    </div>
  );
};

export default ValetTracker;
