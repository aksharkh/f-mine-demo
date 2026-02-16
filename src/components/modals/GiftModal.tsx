import React from 'react';
import { Gift } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { type MenuItem } from '../../types';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[]; // Need menu items to display gift options
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, menuItems }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Gift size={20}/> Gift a Table
      </h2>
      <p className="text-sm text-white/60 mb-4">Send a drink or dessert to another table.</p>
      <input type="number" placeholder="Table Number" className="w-full bg-white/5 p-3 rounded-xl border border-white/10 mb-4 text-white" />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {menuItems.filter(i => i.category === 'dessert' || i.category === 'coffee').map(i => (
          <div key={i.id} className="min-w-[80px] p-2 bg-white/5 rounded-lg border border-white/10 text-center cursor-pointer hover:bg-white/10">
            <div className="text-xs font-bold truncate">{i.name}</div>
            <div className="text-[10px] text-[#d94e28]">${i.price}</div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4">Send Gift</Button>
    </Modal>
  );
};

export default GiftModal;
