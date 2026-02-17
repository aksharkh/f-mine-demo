import React from 'react';
import { QrCode, Star, Trophy, Gift, History } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const LoyaltyCard: React.FC = () => {
    const { loyaltyPoints } = useStore();
    const nextReward = 3000;
    const progress = Math.min(100, (loyaltyPoints / nextReward) * 100);

    const rewards = [
        { id: '1', name: 'Free Coffee', cost: 500, icon: Star },
        { id: '2', name: 'Dessert on House', cost: 1000, icon: Gift },
        { id: '3', name: 'Dinner for 2', cost: 3000, icon: Trophy },
    ];

    const handleAddPoints = () => {
        store.addLoyaltyPoints(150);
        toast.success('+150 Points Earned!');
    };

    const handleRedeem = (cost: number, name: string) => {
        if (store.redeemLoyaltyPoints(cost)) {
            toast.success(`Redeemed: ${name}`);
        } else {
            toast.error('Not enough points');
        }
    };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Card Side */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl group cursor-default">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d94e28]/20 blur-[60px] rounded-full group-hover:bg-[#d94e28]/30 transition-all duration-500"></div>

            <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full mx-auto flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                    <Trophy size={40} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                </div>
                
                <h2 className="text-3xl font-serif font-bold text-white mb-1">Platinum Member</h2>
                <p className="text-white/40 text-sm">Member since 2023</p>

                <div className="my-10 relative">
                    <div className="text-7xl font-bold text-white font-mono tracking-tighter drop-shadow-lg">{loyaltyPoints}</div>
                    <div className="text-[#d94e28] text-sm font-bold uppercase tracking-widest mt-2">Current Points</div>
                </div>

                <div className="bg-black/40 p-5 rounded-xl border border-white/5 text-left mb-8 backdrop-blur-sm">
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-white/60">Next Reward: <span className="text-white font-bold">Free Dinner for 2</span></span>
                        <span className="text-white/40 font-mono">{loyaltyPoints}/{nextReward}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 shadow-[0_0_10px_orange]" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="mt-3 text-xs text-white/30 text-center italic">
                        {Math.max(0, nextReward - loyaltyPoints)} more points needed to unlock
                    </div>
                </div>

                <Button className="w-full gap-2 py-3 text-lg" onClick={handleAddPoints}><QrCode size={20}/> Simulate Scan (+150)</Button>
            </div>
        </div>

        {/* Rewards Side */}
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white font-serif mb-4 flex items-center gap-2"><Gift size={24}/> Available Rewards</h3>
            
            <div className="space-y-4">
                {rewards.map(reward => {
                    const canAfford = loyaltyPoints >= reward.cost;
                    return (
                        <div key={reward.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all ${canAfford ? 'bg-[#1a1a1a] border-white/10 hover:border-white/30' : 'bg-white/5 border-transparent opacity-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${canAfford ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-500' : 'bg-white/5 text-white/20'}`}>
                                    <reward.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{reward.name}</h4>
                                    <div className="text-sm text-white/40 font-mono">{reward.cost} pts</div>
                                </div>
                            </div>
                            <Button variant={canAfford ? 'primary' : 'outline'} disabled={!canAfford} onClick={() => handleRedeem(reward.cost, reward.name)}>
                                {canAfford ? 'Redeem' : 'Locked'}
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mt-8">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><History size={16}/> Recent Activity</h4>
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <div>
                                <div className="text-white">Order #102{i}</div>
                                <div className="text-white/40 text-xs">Today, 12:30 PM</div>
                            </div>
                            <div className="text-green-400 font-mono font-bold">+150</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default LoyaltyCard;
