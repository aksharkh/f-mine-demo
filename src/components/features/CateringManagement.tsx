import React, { useState } from 'react';
import { Truck, Calendar, DollarSign, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { type CateringEvent } from '../../types';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const MOCK_EVENTS: CateringEvent[] = [
    { id: '1', clientName: 'TechCorp Annual Sync', date: '2024-04-15', guests: 150, location: 'Downtown Conf Center', status: 'Booked', totalValue: 4500 },
    { id: '2', clientName: 'Smith Wedding', date: '2024-05-20', guests: 80, location: 'Botanical Gardens', status: 'Lead', totalValue: 8000 },
    { id: '3', clientName: 'City Hospital Gala', date: '2024-06-10', guests: 300, location: 'Grand Hotel Ballroom', status: 'Proposal Sent', totalValue: 15000 },
];

const CateringManagement: React.FC = () => {
  const [events, setEvents] = useState<CateringEvent[]>(MOCK_EVENTS);
  const [filter, setFilter] = useState('All');

  const filteredEvents = filter === 'All' ? events : events.filter(e => e.status === filter);

  const updateStatus = (id: string, newStatus: string) => {
      setEvents(events.map(e => e.id === id ? { ...e, status: newStatus as CateringEvent['status'] } : e));
      toast.success(`Event Status Updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Truck /> Catering Management</h2>
         <Button>+ New Event Lead</Button>
      </div>

       <div className="flex gap-2 mb-4">
           {['All', 'Lead', 'Proposal Sent', 'Booked', 'Completed', 'Cancelled'].map(status => (
               <button 
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === status ? 'bg-white text-black' : 'bg-white/5 text-zinc-400 hover:text-white'}`}
               >
                   {status}
               </button>
           ))}
       </div>

       <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 uppercase font-bold text-xs">
                    <tr>
                        <th className="p-4">Client / Event</th>
                        <th className="p-4">Date & Loc</th>
                        <th className="p-4">Guests</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Value</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredEvents.map(event => (
                        <tr key={event.id} className="hover:bg-white/5 transition group">
                            <td className="p-4">
                                <div className="text-white font-bold text-base">{event.clientName}</div>
                                <div className="text-zinc-500 text-xs text-mono mt-1">ID: {event.id}</div>
                            </td>
                            <td className="p-4">
                                <div className="text-white flex items-center gap-2 mb-1"><Calendar size={14} className="text-blue-400"/> {event.date}</div>
                                <div className="text-zinc-400 text-xs flex items-center gap-2"><Truck size={12}/> {event.location}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2 text-zinc-300 bg-white/5 w-fit px-2 py-1 rounded"><Users size={14}/> {event.guests}</div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border flex w-fit items-center gap-1 ${
                                    event.status === 'Booked' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                                    event.status === 'Lead' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                                    event.status === 'Proposal Sent' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                                }`}>
                                    {event.status === 'Booked' && <CheckCircle size={10}/>}
                                    {event.status === 'Lead' && <Clock size={10}/>}
                                    {event.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="text-green-400 font-bold flex items-center justify-end gap-1 text-base"><DollarSign size={14}/> {event.totalValue.toLocaleString()}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex justify-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition">
                                    {event.status === 'Lead' && <Button onClick={() => updateStatus(event.id, 'Proposal Sent')} className="text-xs h-8 px-2">Send Proposal</Button>}
                                    {event.status === 'Proposal Sent' && <Button onClick={() => updateStatus(event.id, 'Booked')} className="text-xs h-8 px-2 bg-green-600 hover:bg-green-500">Confirm Book</Button>}
                                    {event.status === 'Booked' && <Button onClick={() => updateStatus(event.id, 'Completed')} className="text-xs h-8 px-2 bg-blue-600 hover:bg-blue-500">Complete</Button>}
                                    <button className="p-2 hover:bg-white/10 rounded text-zinc-500 hover:text-red-400 transition"><XCircle size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredEvents.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-zinc-500 italic">No events found with this status.</td>
                        </tr>
                    )}
                </tbody>
            </table>
       </div>
    </div>
  );
};

export default CateringManagement;
