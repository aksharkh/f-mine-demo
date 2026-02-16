import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const RefundModal: React.FC<RefundModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
       <h3 className="text-lg font-bold mb-4 text-red-500 flex items-center gap-2">
         <Trash2 size={20}/> Void Order
       </h3>
       <div className="space-y-2 mb-4">
         {['Customer Changed Mind', 'Out of Stock', 'Long Wait', 'Kitchen Error'].map(r => (
           <button 
             key={r} 
             onClick={() => setReason(r)} 
             className={`w-full text-left p-3 rounded border ${reason === r ? 'bg-red-500/20 border-red-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
           >
             {r}
           </button>
         ))}
       </div>
       <Button onClick={() => onConfirm(reason)} className="w-full bg-red-600 hover:bg-red-500">Confirm Void</Button>
    </Modal>
  );
};

export default RefundModal;
