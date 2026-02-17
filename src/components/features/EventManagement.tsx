import React, { useState } from 'react';
import { Calendar, Users, Briefcase, PartyPopper, Heart } from 'lucide-react';
import { type EventBooking } from '../../types';
import Button from '../ui/Button';

const MOCK_EVENTS: EventBooking[] = [
  { id: '1', name: 'Smith Wedding Reception', date: '2024-04-20', guests: 120, type: 'wedding', depositPaid: true, status: 'confirmed' },
  { id: '2', name: 'Tech Corp Dinner', date: '2024-03-25', guests: 25, type: 'corporate', depositPaid: false, status: 'inquiry' },
];

const EventManagement: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [events] = useState<EventBooking[]>(MOCK_EVENTS);

  const getIcon = (type: string) => {
    switch(type) {
        case 'wedding': return <Heart className="text-pink-500" />;
        case 'corporate': return <Briefcase className="text-blue-500" />;
        default: return <PartyPopper className="text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar /> Event Management</h2>
         <Button>+ New Booking</Button>
      </div>

      <div className="space-y-4">
        {events.map(event => (
            <div key={event.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 flex items-center justify-between hover:border-white/20 transition">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-2xl">
                        {getIcon(event.type)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                         <div className="flex items-center gap-4 text-zinc-400 text-sm">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {event.date}</span>
                            <span className="flex items-center gap-1"><Users size={14}/> {event.guests} Guests</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                         <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                            event.status === 'confirmed' ? 'text-green-500' : 'text-orange-500'
                         }`}>{event.status}</div>
                         <div className="text-xs text-zinc-500">{event.depositPaid ? 'Deposit Paid' : 'Deposit Pending'}</div>
                    </div>
                     <Button variant="outline" className="text-sm">Manage</Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default EventManagement;
