import React, { useState } from 'react';
import { Crown, Star } from 'lucide-react';
import { type VipGuest } from '../../types';

const MOCK_VIPS: VipGuest[] = [
  { id: '1', name: 'James Cameron', preferences: 'Table 4, Sparkling Water, No Parsley', visits: 42, avgSpend: 150.00, lastVisit: '2 days ago' },
  { id: '2', name: 'Lady Gaga', preferences: 'Corner Booth, Vegan Menu', visits: 12, avgSpend: 300.00, lastVisit: '1 month ago' },
];

const VipAlerts: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vips] = useState<VipGuest[]>(MOCK_VIPS);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Crown className="text-yellow-500" /> VIP Guest Alerts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vips.map(vip => (
            <div key={vip.id} className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-yellow-500/30 p-6 relative overflow-hidden group hover:border-yellow-500/60 transition shadow-lg shadow-yellow-900/10">
                <div className="absolute top-0 right-0 p-4 opacity-50"><Crown size={48} className="text-yellow-500/20" /></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xl border-2 border-white">
                             {vip.name.charAt(0)}
                         </div>
                         <div>
                             <h3 className="font-bold text-xl text-white">{vip.name}</h3>
                             <div className="flex items-center gap-1 text-xs text-yellow-500">
                                 <Star size={12} fill="currentColor" /> VIP Tier 1
                             </div>
                         </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="text-xs text-zinc-500 uppercase block mb-1">Preferences</span>
                            <span className="text-sm text-zinc-200">{vip.preferences}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                             <div className="text-2xl font-bold text-white">{vip.visits}</div>
                             <div className="text-xs text-zinc-500">Visits</div>
                        </div>
                        <div>
                             <div className="text-2xl font-bold text-green-400">${vip.avgSpend}</div>
                             <div className="text-xs text-zinc-500">Avg Spend</div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default VipAlerts;
