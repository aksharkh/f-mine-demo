import React, { useState } from 'react';
import { Map, MapPin } from 'lucide-react';
import { type Location } from '../../types';

const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'Downtown Branch', address: '123 Main St, City', manager: 'Sarah J.', isActive: true },
  { id: '2', name: 'Westside Mall', address: '456 West Ave, City', manager: 'Mike R.', isActive: false },
];

const LocationManager: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [locations] = useState<Location[]>(MOCK_LOCATIONS);
  const [activeLoc, setActiveLoc] = useState('1');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Map /> Multi-Locations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map(loc => (
            <div 
                key={loc.id} 
                className={`rounded-xl border p-6 cursor-pointer transition-all ${activeLoc === loc.id ? 'bg-primary/10 border-primary' : 'bg-[#1a1a1a] border-white/10 hover:border-white/30'}`}
                onClick={() => setActiveLoc(loc.id)}
            >
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeLoc === loc.id ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{loc.name}</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <span className={`w-2 h-2 rounded-full ${loc.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-zinc-400">{loc.isActive ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>
                     </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-white/5 py-2">
                        <span className="text-zinc-500">Address</span>
                        <span className="text-zinc-300">{loc.address}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-zinc-500">Manager</span>
                        <span className="text-zinc-300">{loc.manager}</span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default LocationManager;
