import React, { useState } from 'react';
import { X, ShoppingBag, BrainCircuit, Crown, CheckSquare, Clock, Minus, Plus, CreditCard, Smartphone, Banknote, Repeat } from 'lucide-react';
import { CURRENCIES } from '../../lib/constants';
import { type CartItem, type Order } from '../../types';
import Button from '../ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (index: number) => void;
  onSubmit: (total: number, isPriority: boolean, scheduledTime: string) => void;
  total: number;
  orderHistory: Order[];
  onShowFeedback: () => void;
  onReorder: (items: any[]) => void;
  currency: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove, 
  onSubmit, 
  total, 
  orderHistory, 
  onShowFeedback, 
  onReorder,
  currency = 'USD'
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'cash'>('card');
  const [splitBill, setSplitBill] = useState(1);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [isPriority, setIsPriority] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [viewHistory, setViewHistory] = useState(false);

  const curr = CURRENCIES[currency];
  const tax = total * 0.1;
  const tip = total * (tipPercentage / 100);
  const priorityFee = isPriority ? 5 : 0;
  const grandTotal = total + tax + tip + priorityFee;

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`relative w-full md:max-w-md bg-[#1a1a1a] h-full shadow-2xl transition-transform duration-300 border-l border-white/10 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a] z-10">
            <h2 className="text-xl md:text-2xl font-serif text-white flex items-center gap-2">
                <ShoppingBag className="text-[#d94e28]" size={20} /> 
                {viewHistory ? 'Order History' : 'Your Order'}
            </h2>
            <div className="flex gap-2">
                <button onClick={() => setViewHistory(!viewHistory)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="History"><Repeat size={18}/></button>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Close"><X size={18}/></button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-32">
            {viewHistory ? (
                <div className="space-y-4">
                    {orderHistory.map(order => (
                        <div key={order.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between mb-2">
                                <span className="font-mono text-xs opacity-60">ID: {order.id}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${order.status === 'served' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{order.status}</span>
                            </div>
                            <div className="space-y-1 mb-3">
                                {order.items.map((item, i) => <div key={i} className="flex justify-between text-sm text-white/80"><span>{item.quantity}x {item.name}</span><span>{curr.symbol}{(item.price * curr.rate).toFixed(2)}</span></div>)}
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => onReorder(order.items)} className="flex-1 text-xs h-8">Reorder</Button>
                                <Button onClick={onShowFeedback} className="flex-1 text-xs h-8 bg-white/10 hover:bg-white/20">Rate</Button>
                            </div>
                        </div>
                    ))}
                    {orderHistory.length === 0 && <p className="text-white/40 text-center py-10">No past orders.</p>}
                </div>
            ) : (
                <>
                  {/* AI Recommendation */}
                  <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-purple-300 font-bold mb-2 text-xs uppercase tracking-widest"><BrainCircuit size={14} /> AI Suggestion</div>
                      <p className="text-sm text-white/80">"A <span className="text-[#d94e28] font-bold">Pinot Noir</span> pairs well with your order."</p>
                      <button className="mt-3 text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/30 transition-all font-bold">+ Add for {curr.symbol}12</button>
                  </div>

                  {cart.length === 0 ? (
                      <div className="text-center py-20 opacity-40">
                          <ShoppingBag size={48} className="mx-auto mb-4" />
                          <p>Your cart is empty</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                        {cart.map((item, index) => (
                            <div key={index} className="flex gap-3 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors group">
                                <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-black/50" alt="" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-serif font-medium truncate text-sm md:text-base leading-tight">{item.name}</h4>
                                        <span className="font-mono text-sm whitespace-nowrap">{curr.symbol}{(item.price * curr.rate).toFixed(2)}</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-1 line-clamp-1">{item.selectedOptions ? Object.values(item.selectedOptions).join(', ') : ''}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-3 bg-black/40 rounded-lg px-2 py-1">
                                            <button className="text-white/60 hover:text-white"><Minus size={12}/></button>
                                            <span className="text-xs font-bold">{item.quantity}</span>
                                            <button className="text-white/60 hover:text-white"><Plus size={12}/></button>
                                        </div>
                                        <button onClick={() => onRemove(index)} className="text-xs text-red-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                      </div>
                  )}

                  {/* Upgrades */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between p-3 bg-[#d94e28]/10 border border-[#d94e28]/30 rounded-xl cursor-pointer hover:bg-[#d94e28]/20 transition-all active:scale-[0.98]" onClick={() => setIsPriority(!isPriority)}>
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isPriority ? 'bg-[#d94e28] text-white' : 'bg-white/5 text-white/40'}`}><Crown size={16} /></div>
                              <div>
                                  <div className="font-bold text-sm">Priority Pass</div>
                                  <div className="text-[10px] opacity-60">Skip the queue (+{curr.symbol}5.00)</div>
                              </div>
                          </div>
                          {isPriority && <CheckSquare size={16} className="text-[#d94e28]" />}
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                             <Clock size={16} className="text-blue-400" />
                             <span className="text-sm font-bold">Schedule Order</span>
                          </div>
                          <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-lg p-2 text-sm text-white focus:border-blue-400 outline-none" />
                      </div>
                  </div>
                </>
            )}
        </div>

        {!viewHistory && cart.length > 0 && (
            <div className="p-5 md:p-6 bg-[#1a1a1a] border-t border-white/10 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
                {/* Tip Selector */}
                <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[0, 10, 15, 20, 25].map(pct => (
                        <button key={pct} onClick={() => setTipPercentage(pct)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${tipPercentage === pct ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{pct === 0 ? 'No Tip' : `${pct}%`}</button>
                    ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs md:text-sm">
                    <div className="flex justify-between text-white/60"><span>Subtotal (x{cart.reduce((a, b) => a + b.quantity, 0)})</span><span>{curr.symbol}{(total * curr.rate).toFixed(2)}</span></div>
                    <div className="flex justify-between text-white/60"><span>Tax (10%)</span><span>{curr.symbol}{(tax * curr.rate).toFixed(2)}</span></div>
                    {tip > 0 && <div className="flex justify-between text-green-400"><span>Tip</span><span>{curr.symbol}{(tip * curr.rate).toFixed(2)}</span></div>}
                    {isPriority && <div className="flex justify-between text-[#d94e28]"><span>Priority Fee</span><span>{curr.symbol}{(priorityFee * curr.rate).toFixed(2)}</span></div>}
                    <div className="flex justify-between text-lg md:text-xl font-serif font-bold text-white pt-2 border-t border-white/10"><span>Total</span><span>{curr.symbol}{(grandTotal * curr.rate).toFixed(2)}</span></div>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${paymentMethod === 'card' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 opacity-50'}`}><CreditCard size={18} className="mb-1"/><span className="text-[10px] font-bold">Card</span></button>
                    <button onClick={() => setPaymentMethod('apple')} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${paymentMethod === 'apple' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 opacity-50'}`}><Smartphone size={18} className="mb-1"/><span className="text-[10px] font-bold">Apple Pay</span></button>
                    <button onClick={() => setPaymentMethod('cash')} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${paymentMethod === 'cash' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 opacity-50'}`}><Banknote size={18} className="mb-1"/><span className="text-[10px] font-bold">Cash</span></button>
                </div>

                <Button onClick={() => onSubmit(total, isPriority, scheduledTime)} className="w-full text-base md:text-lg py-3.5 shadow-xl shadow-orange-500/10 active:scale-[0.98]">Pay {curr.symbol}{(grandTotal * curr.rate).toFixed(2)}</Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
