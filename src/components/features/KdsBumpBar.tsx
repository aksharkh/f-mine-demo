import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const KdsBumpBar: React.FC = () => {
  const [lastKey, setLastKey] = useState<string>('None');
  const [activeTicket, setActiveTicket] = useState(1);
  const [completedTickets, setCompletedTickets] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus container on mount to capture keys
    containerRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
        setLastKey(e.code);
        
        if (e.code === 'ArrowRight') {
            setActiveTicket(prev => Math.min(3, prev + 1));
        }
        if (e.code === 'ArrowLeft') {
            setActiveTicket(prev => Math.max(1, prev - 1));
        }
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            setLastKey('BUMP (Space)');
            if (!completedTickets.includes(activeTicket)) {
                setCompletedTickets(prev => [...prev, activeTicket]);
                toast.success(`Ticket #${activeTicket} Bumped!`);
                // Auto advance
                if (activeTicket < 3) setActiveTicket(prev => prev + 1);
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTicket, completedTickets]);

  return (
    <div ref={containerRef} className="space-y-8 h-[calc(100vh-100px)] flex flex-col items-center justify-center outline-none" tabIndex={0}>
       <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                <Keyboard size={32} /> KDS Bump Bar
            </h2>
            <p className="text-zinc-500">Keyboard Simulation Mode • Use Arrows to Navigate, Space to Bump</p>
       </div>

       {/* Simulated KDS View */}
       <div className="w-full max-w-4xl grid grid-cols-3 gap-4">
            {[1, 2, 3].map(ticketNum => {
                const isCompleted = completedTickets.includes(ticketNum);
                const isActive = activeTicket === ticketNum;
                
                return (
                    <div 
                        key={ticketNum} 
                        className={`rounded-xl border-4 p-6 min-h-[250px] flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                            isActive
                            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105 z-10' 
                            : 'border-zinc-700 bg-zinc-800/50 grayscale opacity-50'
                        } ${isCompleted ? 'border-green-500 bg-green-500/10 opacity-40' : ''}`}
                    >
                        {isCompleted && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                <CheckCircle size={64} className="text-green-500" />
                            </div>
                        )}
                        
                        <div className="text-4xl font-bold text-white mb-2">#{ticketNum}</div>
                        <div className="text-sm text-zinc-400">Order Ticket</div>
                        
                        <div className="mt-6 space-y-2 w-full">
                            <div className="h-2 bg-zinc-700 rounded w-3/4 mx-auto"></div>
                            <div className="h-2 bg-zinc-700 rounded w-1/2 mx-auto"></div>
                        </div>

                        {isActive && !isCompleted && <div className="mt-8 px-3 py-1 bg-blue-500 text-white rounded text-xs font-bold uppercase animate-pulse">Selected</div>}
                    </div>
                );
            })}
       </div>

       {/* Instructions */}
       <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-400">Last Input Detected:</span>
                <span className="text-green-400 font-mono text-xl font-bold">{lastKey}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex justify-between font-mono text-xs" onClick={() => setActiveTicket(Math.max(1, activeTicket - 1))}>
                    <span>PREV</span> <span>←</span>
                </Button>
                <Button variant="outline" className="flex justify-between font-mono text-xs" onClick={() => setActiveTicket(Math.min(3, activeTicket + 1))}>
                    <span>NEXT</span> <span>→</span>
                </Button>
                <Button variant="outline" className="col-span-2 flex justify-between font-mono text-xs bg-white/5" onClick={() => {
                     setCompletedTickets(prev => [...prev, activeTicket]);
                     toast.success(`Ticket #${activeTicket} Bumped!`);
                }}>
                    <span>BUMP / COMPLETE</span> <span>SPACE</span>
                </Button>
            </div>
       </div>
    </div>
  );
};

export default KdsBumpBar;
