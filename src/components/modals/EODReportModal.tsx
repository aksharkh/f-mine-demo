import React from 'react';
import { X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface Stats {
  revenue: number;
  totalOrders: number;
  activeOrders: number;
}

interface EODReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Stats;
}

const EODReportModal: React.FC<EODReportModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg bg-[#121212]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">End of Day Report</h2>
        <button onClick={onClose}>
          <X size={24} className="text-white/60 hover:text-white"/>
        </button>
      </div>
      <div className="space-y-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/40 uppercase">Total Revenue</p>
            <p className="text-2xl font-serif text-[#d94e28]">${stats.revenue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase">Total Orders</p>
            <p className="text-2xl font-serif">{stats.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase">Avg Ticket</p>
            <p className="text-2xl font-serif">${stats.totalOrders ? (stats.revenue / stats.totalOrders).toFixed(2) : '0.00'}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase">Active Staff</p>
            <p className="text-2xl font-serif">3</p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/60">Shift Notes</h4>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-24 resize-none" 
            placeholder="Enter notes..." 
          />
        </div>
        <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-500">Print Z-Report</Button>
      </div>
    </Modal>
  );
};

export default EODReportModal;
