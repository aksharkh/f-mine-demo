import React from 'react';
import { Thermometer } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface HACCPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const HACCPModal: React.FC<HACCPModalProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Thermometer size={20}/> HACCP Temp Check
      </h2>
      <div className="space-y-3">
        <div>
          <label className="text-xs uppercase text-white/50">Main Fridge</label>
          <input type="number" placeholder="°C" className="w-full bg-white/5 rounded-lg p-2 mt-1 border border-white/10 text-white"/>
        </div>
        <div>
          <label className="text-xs uppercase text-white/50">Freezer</label>
          <input type="number" placeholder="°C" className="w-full bg-white/5 rounded-lg p-2 mt-1 border border-white/10 text-white"/>
        </div>
        <div>
          <label className="text-xs uppercase text-white/50">Pass</label>
          <input type="number" placeholder="°C" className="w-full bg-white/5 rounded-lg p-2 mt-1 border border-white/10 text-white"/>
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full mt-4 bg-blue-600">Submit Log</Button>
    </Modal>
  );
};

export default HACCPModal;
