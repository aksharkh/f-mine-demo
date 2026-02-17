import React, { useState } from 'react';
import { Lightbulb, Sun, Moon, PartyPopper, Sliders } from 'lucide-react';
import { type LightZone } from '../../types';
import Button from '../ui/Button';

const MOCK_ZONES: LightZone[] = [
    { id: '1', name: 'Main Dining', brightness: 80, colorTemp: 3500, isOn: true },
    { id: '2', name: 'Bar Area', brightness: 50, colorTemp: 2700, isOn: true },
    { id: '3', name: 'Terrace', brightness: 100, colorTemp: 4000, isOn: true },
    { id: '4', name: 'Private Room', brightness: 0, colorTemp: 3000, isOn: false },
];

const LightingControl: React.FC = () => {
  const [zones, setZones] = useState<LightZone[]>(MOCK_ZONES);
  const [activePreset, setActivePreset] = useState<string | null>('dinner');

  const toggleZone = (id: string) => {
    setZones(zones.map(z => z.id === id ? { ...z, isOn: !z.isOn } : z));
  };

  const updateBrightness = (id: string, val: number) => {
      setZones(zones.map(z => z.id === id ? { ...z, brightness: val } : z));
  };

  const setPreset = (preset: string) => {
      setActivePreset(preset);
      // Mock preset logic: adjust zones based on preset
      const presetValues: Record<string, number> = {
          'brunch': 90,
          'dinner': 60,
          'lounge': 40,
          'party': 75
      };
      
      setZones(zones.map(z => ({
          ...z,
          isOn: true,
          brightness: presetValues[preset] || 50
      })));
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Lightbulb /> Lighting Control</h2>
         <Button variant="outline" className="text-xs"><Sliders size={14} className="mr-2"/> Advanced Settings</Button>
      </div>

        {/* Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => setPreset('brunch')} className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${activePreset === 'brunch' ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] transform scale-105' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20'}`}>
                <Sun size={24} />
                <span className="font-bold tracking-wide">Day / Brunch</span>
            </button>
            <button onClick={() => setPreset('dinner')} className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${activePreset === 'dinner' ? 'bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transform scale-105' : 'bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500/20'}`}>
                <div className="text-2xl">🕯️</div>
                <span className="font-bold tracking-wide">Dinner Service</span>
            </button>
            <button onClick={() => setPreset('lounge')} className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${activePreset === 'lounge' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transform scale-105' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'}`}>
                <Moon size={24} />
                <span className="font-bold tracking-wide">Late Lounge</span>
            </button>
            <button onClick={() => setPreset('party')} className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${activePreset === 'party' ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] transform scale-105' : 'bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20'}`}>
                <PartyPopper size={24} />
                <span className="font-bold tracking-wide">Private Event</span>
            </button>
        </div>

        {/* Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {zones.map(zone => (
                <div key={zone.id} className={`p-6 rounded-xl border transition-all duration-300 ${zone.isOn ? 'bg-[#1a1a1a] border-white/10 shadow-lg' : 'bg-black border-zinc-800 opacity-60 grayscale'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${zone.isOn ? 'text-yellow-400 bg-yellow-400' : 'text-zinc-600 bg-zinc-600'}`}></div>
                            <div>
                                <div className="text-white font-bold text-lg">{zone.name}</div>
                                {zone.isOn && <div className="text-yellow-500/80 text-xs font-mono">{zone.colorTemp}K • {zone.brightness}%</div>}
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleZone(zone.id)}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${zone.isOn ? 'bg-green-500 justify-end' : 'bg-zinc-700 justify-start'}`}
                        >
                            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className={`transition-opacity duration-300 ${!zone.isOn ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                            <div className="flex justify-between text-xs text-zinc-400 mb-2 font-bold uppercase tracking-wider">
                                <span>Dim</span>
                                <span>Brightness</span>
                                <span>Bright</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={zone.brightness} 
                                onChange={(e) => updateBrightness(zone.id, Number(e.target.value))}
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default LightingControl;
