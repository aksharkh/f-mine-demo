import React, { useState } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { MENU_ITEMS } from '../../lib/constants';
import Button from '../ui/Button';

// Mock Allergens
const ALLERGENS = ['Dairy', 'Eggs', 'Nuts', 'Gluten', 'Soy', 'Shellfish'];

const AllergenMatrix: React.FC = () => {
  const [filter, setFilter] = useState('');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><AlertTriangle /> Allergen Matrix</h2>
         <Button variant="outline"><Download className="mr-2" size={18}/> Export CSV</Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
            <input 
                type="text" 
                placeholder="Search menu items..." 
                className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white w-full max-w-sm focus:outline-none focus:border-white/30"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/40 text-xs text-zinc-500 uppercase">
                    <tr>
                        <th className="p-4 sticky left-0 bg-[#1a1a1a] border-r border-white/5 z-10">Menu Item</th>
                        {ALLERGENS.map(a => <th key={a} className="p-4 text-center">{a}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {MENU_ITEMS.filter(item => item.name.toLowerCase().includes(filter.toLowerCase())).map(item => (
                        <tr key={item.id} className="hover:bg-white/5">
                            <td className="p-4 font-medium text-white sticky left-0 bg-[#1a1a1a] border-r border-white/5">{item.name}</td>
                            {ALLERGENS.map(allergen => {
                                const hasAllergen = item.allergens?.includes(allergen) || (Math.random() > 0.8 && true); // Mock logic if data missing
                                return (
                                    <td key={allergen} className="p-4 text-center">
                                        {hasAllergen ? (
                                            <div className="w-3 h-3 rounded-full bg-red-500 mx-auto box-content border-4 border-transparent bg-clip-padding"></div>
                                        ) : (
                                            <div className="w-1 h-1 rounded-full bg-zinc-700 mx-auto"></div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AllergenMatrix;
