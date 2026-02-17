import React, { useState } from 'react';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../lib/store';

const TurnoverHeatmap: React.FC = () => {
  const { heatmapData } = useStore();
  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');

  const getHeatColor = (count: number) => {
    if (count >= 10) return 'bg-red-500/80 hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse-slow';
    if (count >= 5) return 'bg-orange-500/80 hover:bg-orange-400';
    return 'bg-green-500/80 hover:bg-green-400';
  };

  const filteredData = heatmapData.filter(d => {
      if (filter === 'high') return d.turnoverCount >= 10;
      if (filter === 'low') return d.turnoverCount < 5;
      return true;
  });

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 h-[calc(100vh-100px)] flex flex-col">
       <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><ArrowUpRight /> Table Turnover Heatmap</h2>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded text-sm font-medium transition ${filter === 'all' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-white'}`}>All Tables</button>
                <button onClick={() => setFilter('high')} className={`px-4 py-1.5 rounded text-sm font-medium transition ${filter === 'high' ? 'bg-red-900/30 text-red-300 shadow' : 'text-zinc-500 hover:text-white'}`}>High Traffic</button>
                <button onClick={() => setFilter('low')} className={`px-4 py-1.5 rounded text-sm font-medium transition ${filter === 'low' ? 'bg-green-900/30 text-green-300 shadow' : 'text-zinc-500 hover:text-white'}`}>Slow Turn</button>
            </div>
       </div>
       
       <div className="flex-1 relative bg-[#111] rounded-2xl border border-white/5 overflow-hidden p-8 flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent)] pointer-events-none"></div>

            {/* Legend */}
            <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs space-y-3 z-10 shadow-xl">
                <div className="font-bold text-zinc-400 mb-1 uppercase tracking-wider">Legend</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]"></div> High Traffic ({'>'}10 turns)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_orange]"></div> Med Traffic ({'>'}5 turns)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_green]"></div> Low Traffic ({'<'}5 turns)</div>
            </div>

            {/* Visual Floor Map Simulation */}
            <div className="grid grid-cols-4 gap-12 w-full max-w-5xl">
                {filteredData.map(data => (
                    <div key={data.tableId} className={`rounded-xl flex flex-col items-center justify-center text-white backdrop-blur-sm transition-all border-2 border-white/10 transform hover:scale-105 hover:-translate-y-1 cursor-pointer group ${getHeatColor(data.turnoverCount)} aspect-square relative`}>
                        <span className="text-3xl font-black shadow-black drop-shadow-lg opacity-90">T{data.tableId}</span>
                        
                        {/* Hover Details */}
                        <div className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/90 px-4 py-2 rounded-lg border border-white/20 shadow-xl z-20 w-48 text-center pointer-events-none translate-y-2 group-hover:translate-y-0">
                            <div className="text-sm font-bold text-white mb-1">Table {data.tableId} Stats</div>
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span className="flex items-center gap-1"><Users size={10}/> {data.turnoverCount} Parties</span>
                                <span className="flex items-center gap-1"><Clock size={10}/> {data.avgDuration}m avg</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
       </div>
    </div>
  );
};

export default TurnoverHeatmap;
