import React, { useState } from 'react';
import { X, CreditCard, Users, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

interface SplitBillModalProps {
  total: number;
  onClose: () => void;
  onPay: () => void;
}

const SplitBillModal: React.FC<SplitBillModalProps> = ({ total, onClose, onPay }) => {
  const [splitCount, setSplitCount] = useState(1);
  const [paidParts, setPaidParts] = useState<number[]>([]);

  const splitAmount = total / splitCount;
  const remaining = total - (paidParts.length * splitAmount);

  const handlePayPart = () => {
      setPaidParts([...paidParts, Date.now()]);
      toast.success(`Payment of $${splitAmount.toFixed(2)} received`);
      
      if (paidParts.length + 1 >= splitCount) {
          setTimeout(() => {
              onPay();
          }, 500);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold text-white font-serif">Payment</h3>
          <button onClick={onClose}><X size={20} className="text-white/60 hover:text-white"/></button>
        </div>

        <div className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-zinc-400 mb-1">Total Amount</p>
                <div className="text-4xl font-black text-white font-mono">${total.toFixed(2)}</div>
            </div>

            <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                <label className="text-sm text-white/60 mb-2 block flex items-center gap-2"><Users size={14}/> Split Bill</label>
                <div className="flex items-center gap-4">
                    <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))} className="w-10 h-10 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xl transition-colors">-</button>
                    <div className="flex-1 text-center font-bold text-white text-xl">{splitCount} Ways</div>
                    <button onClick={() => setSplitCount(Math.min(10, splitCount + 1))} className="w-10 h-10 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xl transition-colors">+</button>
                </div>
                {splitCount > 1 && (
                    <div className="text-center mt-3 text-[#d94e28] font-mono">
                        ${splitAmount.toFixed(2)} / person
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {Array.from({ length: splitCount }).map((_, i) => {
                    const isPaid = i < paidParts.length;
                    return (
                        <div key={i} className={`p-3 rounded-lg border flex justify-between items-center transition-all ${isPaid ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-white/5 border-white/10 text-white'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPaid ? 'bg-green-500 text-black' : 'bg-white/10'}`}>
                                    {isPaid ? <Check size={16}/> : <span className="text-xs font-bold">{i+1}</span>}
                                </div>
                                <span className={isPaid ? 'line-through opacity-50' : ''}>Person {i+1}</span>
                            </div>
                            <span className="font-mono">${splitAmount.toFixed(2)}</span>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4">
                {remaining > 0.01 ? (
                    <Button onClick={handlePayPart} className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-none shadow-lg">
                        <CreditCard size={20}/> Pay ${splitAmount.toFixed(2)}
                    </Button>
                ) : (
                    <div className="bg-green-500/20 text-green-400 p-4 rounded-xl text-center font-bold border border-green-500/50 flex items-center justify-center gap-2">
                        <Check size={20}/> Payment Complete
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SplitBillModal;
