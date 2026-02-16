import React, { useState } from 'react';

import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ReservationData {
  partySize: number;
  time: string;
  name: string;
  notes: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserve: (data: ReservationData) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onReserve }) => {
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState("19:00");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleReserve = () => {
    onReserve({ partySize, time, name, notes });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <h2 className="text-2xl font-serif text-white mb-6">Reserve a Table</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase text-white/40 block mb-2">Party Size</label>
          <div className="flex gap-2">
            {[2, 4, 6, 8].map(size => (
              <button 
                key={size} 
                onClick={() => setPartySize(size)} 
                className={`flex-1 py-3 rounded-lg border font-bold ${partySize === size ? 'bg-[#d94e28] border-[#d94e28] text-white' : 'bg-transparent border-white/10 text-white/60'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs uppercase text-white/40 block mb-2">Time</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d94e28]">
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-white/40 block mb-2">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d94e28]" />
        </div>
        <div>
          <label className="text-xs uppercase text-white/40 block mb-2">Special Occasion</label>
          <div className="flex gap-2">
            <button onClick={() => setNotes("Birthday")} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-[#d94e28]">Birthday</button>
            <button onClick={() => setNotes("Anniversary")} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-[#d94e28]">Anniversary</button>
            <button onClick={() => setNotes("Date")} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-[#d94e28]">Date</button>
          </div>
        </div>
        <Button onClick={handleReserve} className="w-full mt-4">Confirm Reservation</Button>
      </div>
    </Modal>
  );
};

export default ReservationModal;
