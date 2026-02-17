import React, { useState } from 'react';
import { Globe, TrendingUp, DollarSign, MapPin, AlertCircle } from 'lucide-react';
import { type FranchiseStore } from '../../types';
import Button from '../ui/Button';

const MOCK_STORES: FranchiseStore[] = [
    { id: '1', name: 'Downtown Flagship', location: 'New York, NY', monthlyRevenue: 125000, royaltyDue: 6250, performanceScore: 95 },
    { id: '2', name: 'Westside Express', location: 'Los Angeles, CA', monthlyRevenue: 85000, royaltyDue: 4250, performanceScore: 88 },
    { id: '3', name: 'Miami Beach', location: 'Miami, FL', monthlyRevenue: 95000, royaltyDue: 4750, performanceScore: 92 },
    { id: '4', name: 'Chicago Loop', location: 'Chicago, IL', monthlyRevenue: 60000, royaltyDue: 3000, performanceScore: 75 },
];

const FranchiseDashboard: React.FC = () => {
  const [stores] = useState<FranchiseStore[]>(MOCK_STORES);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const totalRevenue = stores.reduce((acc, s) => acc + s.monthlyRevenue, 0);
  const totalRoyalty = stores.reduce((acc, s) => acc + s.royaltyDue, 0);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Globe /> Franchise HQ</h2>
         <div className="flex gap-6">
             <div className="text-right">
                 <div className="text-xs text-zinc-500 uppercase font-bold">Total Network Revenue</div>
                 <div className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</div>
             </div>
             <div className="text-right">
                 <div className="text-xs text-zinc-500 uppercase font-bold text-green-400">Total Royalties</div>
                 <div className="text-2xl font-black text-green-400">${totalRoyalty.toLocaleString()}</div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stores.map(store => (
                <div key={store.id} className={`bg-[#1a1a1a] rounded-xl border p-6 transition-all hover:border-white/20 cursor-pointer ${selectedStore === store.id ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/10'}`} onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-white font-bold text-lg">{store.name}</h3>
                            <div className="text-zinc-500 text-sm flex items-center gap-1"><MapPin size={12}/> {store.location}</div>
                        </div>
                        <div className={`text-xl font-bold flex flex-col items-end ${store.performanceScore >= 90 ? 'text-green-400' : store.performanceScore >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {store.performanceScore}
                            <span className="text-[10px] text-zinc-500 uppercase font-normal">Score</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                            <div className="flex items-center gap-2 text-zinc-400 text-sm"><TrendingUp size={14}/> Revenue</div>
                            <div className="text-white font-bold">${store.monthlyRevenue.toLocaleString()}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center border border-green-500/20 bg-green-500/5">
                            <div className="flex items-center gap-2 text-green-300 text-sm"><DollarSign size={14}/> Royalty (5%)</div>
                            <div className="text-green-400 font-bold">${store.royaltyDue.toLocaleString()}</div>
                        </div>
                    </div>

                    {selectedStore === store.id && (
                        <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-fade-in">
                             <h4 className="text-white font-bold text-sm">Auditor Notes</h4>
                             {store.performanceScore < 80 ? (
                                 <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs text-red-300 flex items-start gap-2">
                                     <AlertCircle size={14} className="mt-0.5 flex-shrink-0"/>
                                     <div>
                                         <p className="font-bold mb-1">Attention Required</p>
                                         <p>Sales down 15% MoM. Cleanliness score below threshold. Immediate review recommended.</p>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-xs text-green-300 flex items-start gap-2">
                                     <TrendingUp size={14} className="mt-0.5 flex-shrink-0"/>
                                     <div>
                                         <p className="font-bold mb-1">Top Performer</p>
                                         <p>Exceeding targets. Customer satisfaction at all time high.</p>
                                     </div>
                                 </div>
                             )}
                             <Button className="w-full text-xs bg-zinc-700 hover:bg-zinc-600">Download Full Audit Report</Button>
                        </div>
                    )}
                </div>
            ))}
      </div>
    </div>
  );
};

export default FranchiseDashboard;
