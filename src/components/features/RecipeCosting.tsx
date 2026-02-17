import React from 'react';
import { Calculator, PieChart, DollarSign, Plus } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import { toast } from 'react-hot-toast';

const RecipeCosting: React.FC = () => {
  const { recipeCosts } = useStore();

  const updateIngredientCost = (recipeId: string, ingredientIndex: number, newCost: number) => {
      const recipe = recipeCosts.find(r => r.id === recipeId);
      if (!recipe) return;

      const newIngredients = [...recipe.ingredients];
      newIngredients[ingredientIndex] = { ...newIngredients[ingredientIndex], cost: newCost };
      
      const newTotal = newIngredients.reduce((sum, ing) => sum + ing.cost, 0);
      const newMargin = Math.round(((recipe.sellingPrice - newTotal) / recipe.sellingPrice) * 100);

      store.updateRecipeCost(recipeId, {
          ingredients: newIngredients,
          totalCost: newTotal,
          marginPercent: newMargin
      });
      toast.success('Cost Updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calculator /> Recipe Costing & Engineering</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipeCosts.map(recipe => (
            <div key={recipe.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PieChart size={64}/>
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white">Truffle Mushroom Toast</h3>
                        <p className="text-zinc-400 text-sm">Ref. ID: {recipe.id}</p>
                    </div>
                    <div className={`text-2xl font-black ${recipe.marginPercent >= 70 ? 'text-green-500' : recipe.marginPercent >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {recipe.marginPercent}%
                    </div>
                </div>

                <div className="space-y-4 mb-6 relative z-10">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-white/5 pb-2">Ingredient Breakedown</h4>
                    {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex justify-between items-center text-sm group/ing">
                            <span className="text-zinc-300">{ing.name} <span className="text-zinc-600 text-xs">({ing.quantity})</span></span>
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-500 text-xs">$</span>
                                <input 
                                    type="number" 
                                    step="0.10"
                                    className="w-16 bg-black/30 border border-white/10 rounded px-1 py-0.5 text-right text-white focus:border-primary outline-none transition-all"
                                    value={ing.cost.toFixed(2)}
                                    onChange={(e) => updateIngredientCost(recipe.id, i, parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-black/40 rounded-xl p-4 flex flex-col gap-4 relative z-10 border border-white/5">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500 text-sm">Total Cost</span>
                        <span className="text-xl font-bold text-white flex items-center"><DollarSign size={16}/>{recipe.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-2">
                        <span className="text-zinc-500 text-sm">Menu Price</span>
                        <span className="text-xl font-bold text-primary flex items-center"><DollarSign size={16}/>{recipe.sellingPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mt-2">
                        <div className={`h-full transition-all duration-500 ${recipe.marginPercent >= 70 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${recipe.marginPercent}%` }}></div>
                    </div>
                    <div className="text-center text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Profit Margin Analysis</div>
                </div>
            </div>
        ))}

        <div className="bg-[#1a1a1a] border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/40 transition-colors cursor-pointer min-h-[300px] group">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-black transition-colors">
                 <Plus size={32} />
            </div>
            <p className="font-medium">Add New Recipe</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCosting;
