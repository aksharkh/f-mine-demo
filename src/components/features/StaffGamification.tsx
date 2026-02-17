import React, { useState } from 'react';
import { Trophy, Star, TrendingUp, Medal, Flame } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const StaffGamification: React.FC = () => {
  const { gamificationStats } = useStore();
  const [showQuest, setShowQuest] = useState(true);

  const completeQuest = () => {
      store.addXP(150);
      toast.success('Quest Completed! +150 XP');
      setShowQuest(false);
  };

  const simulateWork = () => {
      store.addXP(10);
      toast.success('Work Logged! +10 XP', { icon: '⚒️' });
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Trophy /> Staff Gamification</h2>
         <div className="flex items-center gap-2">
             <span className="text-zinc-400">Level {gamificationStats.level}</span>
             <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-500" style={{width: `${(gamificationStats.xp % 1000) / 10}%`}}></div>
             </div>
         </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 flex items-center gap-4">
               <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-500"><Star /></div>
               <div>
                   <div className="text-2xl font-black text-white">{gamificationStats.xp.toLocaleString()}</div>
                   <div className="text-zinc-500 text-xs uppercase font-bold">Total XP</div>
               </div>
           </div>
           <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 flex items-center gap-4">
               <div className="bg-orange-500/20 p-3 rounded-full text-orange-500"><Flame /></div>
               <div>
                   <div className="text-2xl font-black text-white">{gamificationStats.streak} Days</div>
                   <div className="text-zinc-500 text-xs uppercase font-bold">Login Streak</div>
               </div>
           </div>
           <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 flex items-center gap-4">
               <div className="bg-blue-500/20 p-3 rounded-full text-blue-500"><TrendingUp /></div>
               <div>
                   <div className="text-2xl font-black text-white">#{gamificationStats.leaderboardRank}</div>
                   <div className="text-zinc-500 text-xs uppercase font-bold">Leaderboard Rank</div>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="space-y-4">
               <h3 className="text-white font-bold">Active Quests</h3>
               {showQuest && (
                   <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                       <div className="relative z-10">
                           <h4 className="text-white font-bold text-lg mb-2">Dinner Rush Hero</h4>
                           <p className="text-zinc-300 text-sm mb-4">Complete 20 orders during peak hours (18:00 - 20:00) with avg prep time under 15 mins.</p>
                           <div className="flex items-center justify-between">
                               <span className="text-yellow-400 font-bold text-sm">+150 XP Reward</span>
                               <Button onClick={completeQuest} className="bg-white text-black hover:bg-zinc-200 border-none">Claim Reward</Button>
                           </div>
                       </div>
                   </div>
               )}
               <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 opacity-60">
                   <h4 className="text-white font-bold mb-1">Perfect Week</h4>
                   <p className="text-zinc-500 text-xs">Clock in on time for 5 consecutive shifts.</p>
               </div>
           </div>

           <div className="space-y-4">
                <h3 className="text-white font-bold">Badges & Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                    {gamificationStats.badges.map((badge, i) => (
                        <div key={i} className="bg-[#1a1a1a] p-3 rounded-lg border border-white/10 flex items-center gap-3">
                            <Medal className="text-yellow-500" size={20}/>
                            <span className="text-zinc-300 text-sm font-medium">{badge}</span>
                        </div>
                    ))}
                    <div className="bg-[#1a1a1a] p-3 rounded-lg border border-white/10 flex items-center gap-3 opacity-40 border-dashed">
                        <Medal className="text-zinc-600" size={20}/>
                        <span className="text-zinc-500 text-sm font-medium">Locked Badge</span>
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10">
                    <Button onClick={simulateWork} className="w-full py-4 text-lg">Simulate Work Task (Earn XP)</Button>
                </div>
           </div>
       </div>
    </div>
  );
};

export default StaffGamification;
