import React from 'react';
import { X } from 'lucide-react';
import { type MenuItem } from '../../types';

interface RecipeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  // This modal has a custom layout larger than standard Modal, so we keep the custom wrapper
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1a1a] border border-white/20 text-white p-8 w-full max-w-2xl shadow-2xl rounded-2xl animate-in zoom-in duration-300 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[#d94e28] uppercase text-xs font-bold tracking-widest">Plating Guide</span>
            <h2 className="text-3xl font-serif mt-1">{item.name}</h2>
          </div>
          <button onClick={onClose}>
            <X size={24} className="text-white/60 hover:text-white"/>
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img src={item.image} className="w-full h-48 object-cover rounded-xl border border-white/10" alt={item.name} />
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-sm font-bold uppercase mb-2">Ingredients</h4>
              <p className="text-sm text-white/60 leading-relaxed">{item.ingredients}</p>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold mb-4">Assembly Instructions</h4>
            <div className="space-y-4">
              {item.instructions?.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#d94e28]/20 text-[#d94e28] flex items-center justify-center font-bold border border-[#d94e28]/50 flex-shrink-0">
                    {i+1}
                  </div>
                  <p className="text-white/80 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
