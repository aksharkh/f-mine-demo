import React from 'react';
import { Truck, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface SupplierOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lowStockItems: { id: string; name: string; currentStock: number }[];
}

const SupplierOrderModal: React.FC<SupplierOrderModalProps> = ({ isOpen, onClose, lowStockItems }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
            <Truck size={24}/>
          </div>
          <h2 className="text-2xl font-serif">Supplier Order</h2>
        </div>
        <button onClick={onClose}>
          <X size={24} className="text-white/60 hover:text-white"/>
        </button>
      </div>
      <div className="space-y-4 mb-6">
        <p className="text-white/60 text-sm">The following items are low in stock and need replenishment:</p>
        <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/10">
          {lowStockItems.length === 0 ? (
            <div className="p-4 text-center text-white/40">All stock levels are healthy!</div>
          ) : (
            lowStockItems.map(item => (
              <div key={item.id} className="p-3 flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <span className="text-red-400 text-xs font-bold uppercase bg-red-900/20 px-2 py-1 rounded">Qty: {item.currentStock || 0}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-500">Send Order Email</Button>
    </Modal>
  );
};

export default SupplierOrderModal;
