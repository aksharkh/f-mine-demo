import React, { useState } from 'react';
import { TrendingUp, CloudRain, Sun, Cloud, Info } from 'lucide-react';
import { type ForecastData } from '../../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../ui/Button';

const MOCK_FORECAST: ForecastData[] = [
  { date: 'Mon', predictedSales: 1200, weather: 'rainy', events: 'None' },
  { date: 'Tue', predictedSales: 1450, weather: 'cloudy', events: 'None' },
  { date: 'Wed', predictedSales: 1800, weather: 'sunny', events: 'Market Day' },
  { date: 'Thu', predictedSales: 1600, weather: 'sunny', events: 'None' },
  { date: 'Fri', predictedSales: 3500, weather: 'sunny', events: 'Live Music' },
  { date: 'Sat', predictedSales: 4200, weather: 'cloudy', events: 'Weekend' },
  { date: 'Sun', predictedSales: 3800, weather: 'rainy', events: 'Brunch' },
];

const AiForecast: React.FC = () => {
  const [data, setData] = useState<ForecastData[]>(MOCK_FORECAST);
  const [activeScenario, setActiveScenario] = useState<'base' | 'optimistic' | 'pessimistic'>('base');

  const applyScenario = (scenario: 'base' | 'optimistic' | 'pessimistic') => {
      setActiveScenario(scenario);
      const multiplier = scenario === 'optimistic' ? 1.2 : scenario === 'pessimistic' ? 0.8 : 1.0;
      setData(MOCK_FORECAST.map(d => ({
          ...d,
          predictedSales: Math.round(d.predictedSales * multiplier)
      })));
  };

  const getWeatherIcon = (w: string) => {
    switch (w) {
      case 'rainy': return <CloudRain size={16} className="text-blue-400" />;
      case 'sunny': return <Sun size={16} className="text-yellow-400" />;
      default: return <Cloud size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-purple-400" /> AI Sales Forecast</h2>
         <div className="flex items-center gap-4">
             <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/10">
                 <button onClick={() => applyScenario('pessimistic')} className={`px-3 py-1 rounded text-xs transition ${activeScenario === 'pessimistic' ? 'bg-red-500/20 text-red-400' : 'text-zinc-500 hover:text-white'}`}>Likely Low</button>
                 <button onClick={() => applyScenario('base')} className={`px-3 py-1 rounded text-xs transition ${activeScenario === 'base' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:text-white'}`}>Base Case</button>
                 <button onClick={() => applyScenario('optimistic')} className={`px-3 py-1 rounded text-xs transition ${activeScenario === 'optimistic' ? 'bg-green-500/20 text-green-400' : 'text-zinc-500 hover:text-white'}`}>Optimistic</button>
             </div>
             <div className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-2">
                Confidence: 92% <Info size={14}/>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl border border-white/10 p-6 h-[400px]">
             <h3 className="text-zinc-400 text-sm mb-4">Predicted Revenue (Next 7 Days)</h3>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#333', borderColor: '#444', color: '#fff' }}
                        formatter={(value: any) => [`$${value}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="predictedSales" stroke="#8884d8" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
             </ResponsiveContainer>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 overflow-auto max-h-[400px]">
            <h3 className="text-white font-bold mb-4">Daily Breakdown</h3>
            <div className="space-y-3">
                {data.map((day, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-8 flex justify-center">{getWeatherIcon(day.weather)}</div>
                            <div>
                                <div className="text-white font-medium">{day.date}</div>
                                <div className="text-xs text-zinc-500">{day.events}</div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="font-bold text-green-400">${day.predictedSales}</div>
                             <div className="text-[10px] text-zinc-600">Proj. Covers: {Math.round(day.predictedSales / 45)}</div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
                <Button className="w-full text-xs">Export Forecast CSV</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiForecast;
