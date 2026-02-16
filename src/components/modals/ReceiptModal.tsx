import React from 'react';
import { type Order } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-white text-black font-mono-receipt p-8 w-full max-w-sm shadow-2xl rotate-1 receipt-paper animate-in zoom-in duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Kitchen Ticket</h2>
        <p className="text-sm text-gray-500">Culinary Canvas</p>
      </div>
      <div className="border-b-2 border-dashed border-black/20 pb-4 mb-4">
        <div className="flex justify-between font-bold text-lg mb-2">
          <span>TABLE {order.tableId}</span>
          <span>#{order.id.slice(-4)}</span>
        </div>
        <div className="text-xs text-gray-500">
             {/* Handle Timestamp or Date object */}
            {order.createdAt instanceof Date 
                ? order.createdAt.toLocaleString() 
                : (order.createdAt as any)?.toDate 
                    ? (order.createdAt as any).toDate().toLocaleString() 
                    : 'Now'}
        </div>
        {order.isPriority && <div className="mt-2 text-center border-2 border-black font-bold uppercase py-1">*** PRIORITY VIP ***</div>}
        {order.scheduledTime && <div className="mt-2 text-center bg-blue-100 text-blue-800 font-bold uppercase py-1">SCHEDULED: {order.scheduledTime}</div>}
      </div>
      <div className="space-y-4 mb-8">
        {order.items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-lg">{item.quantity}x {item.name}</span>
            </div>
            {item.course && <div className="text-xs uppercase font-bold text-gray-500 mb-1">[{item.course}]</div>}
            {item.notes && <p className="text-sm bg-black text-white inline-block px-1 mt-1 uppercase">** {item.notes} **</p>}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-dashed border-black/20 pt-4 text-center">
        <Button onClick={onClose} variant="secondary" className="w-full bg-black text-white hover:bg-gray-800">Print Ticket</Button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
