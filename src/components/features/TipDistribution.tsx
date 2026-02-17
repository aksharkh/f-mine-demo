import React from 'react';
import { DollarSign, Users, PieChart, Info } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import { toast } from 'react-hot-toast';

const TipDistribution: React.FC = () => {
  const { tipRules } = useStore();
  const totalPool = 1250.00; // Mock total for visual

  const handleUpdatePercentage = (id: string, newVal: number) => {
      if (newVal < 0 || newVal > 100) return;
      store.updateTipRule(id, newVal);
      toast.success('Rule Updated');
  };

  const totalPercentage = tipRules.reduce((sum, r) => sum + r.percentage, 0);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><DollarSign /> Tip Pooling & Distribution</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pool Summary */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 md:col-span-3 lg:col-span-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <DollarSign size={100} />
            </div>
            <h3 className="text-zinc-500 text-sm mb-2">Total Pool (Today)</h3>
            <div className="text-5xl font-black text-primary mb-6 shadow-black drop-shadow-sm">${totalPool.toFixed(2)}</div>
            <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-zinc-400">Credit Card Tips</span>
                    <span className="text-white font-mono">$850.00</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-zinc-400">Cash Tips</span>
                    <span className="text-white font-mono">$400.00</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                    <span className="text-zinc-400">Estimated Per Hour</span>
                    <span className="text-green-400 font-mono">~$12.50/hr</span>
                </div>
            </div>
        </div>

        {/* Distribution Rules */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 md:col-span-3 lg:col-span-2">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2"><PieChart size={18} /> Distribution Logic</h3>
                 <div className={`px-3 py-1 rounded text-xs font-bold ${totalPercentage === 100 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                     Total: {totalPercentage}%
                 </div>
             </div>

             <div className="space-y-4">
                {tipRules.map(rule => (
                    <div key={rule.id} className="bg-black/20 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between border border-white/5 gap-4">
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                <Users size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-white">{rule.role}</div>
                                <div className="text-xs text-zinc-500">Auto-distributed daily</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 flex-1">
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={rule.percentage} 
                                onChange={(e) => handleUpdatePercentage(rule.id, parseInt(e.target.value))}
                                className="flex-1 accent-primary h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex flex-col items-end w-24">
                                <span className="font-mono text-xl font-bold text-white">{rule.percentage}%</span>
                                <span className="font-mono text-xs text-green-400">${(totalPool * (rule.percentage / 100)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
             
             {totalPercentage !== 100 && (
                 <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                     <Info size={16}/>
                     <span>Warning: Distribution percentages must equal 100%. Current total: {totalPercentage}%</span>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default TipDistribution;
