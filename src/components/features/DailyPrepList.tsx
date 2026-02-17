import React, { useState } from 'react';
import { CheckSquare, ChefHat } from 'lucide-react';
import { type PrepTask } from '../../types';
import Button from '../ui/Button';

const MOCK_PREP: PrepTask[] = [
  { id: '1', item: 'Dice Onions', quantity: '10 kg', station: 'Prep 1', status: 'pending' },
  { id: '2', item: 'Marinate Chicken', quantity: '50 units', station: 'Grill', status: 'in-progress', assignedTo: 'Chef Mike' },
];

const DailyPrepList: React.FC = () => {
  const [tasks, setTasks] = useState<PrepTask[]>(MOCK_PREP);

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><ChefHat /> Daily Prep List</h2>
         <Button>Generate Auto-List</Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        <ul className="divide-y divide-white/5">
            {tasks.map(task => (
                <li key={task.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition">
                    <div className="flex items-center gap-4">
                        <div 
                            onClick={() => toggleStatus(task.id)}
                            className={`w-6 h-6 rounded border cursor-pointer flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-zinc-500'}`}
                        >
                            {task.status === 'completed' && <CheckSquare size={16} className="text-white" />}
                        </div>
                        <div>
                            <div className={`font-medium text-white ${task.status === 'completed' && 'line-through opacity-50'}`}>{task.item}</div>
                            <div className="text-xs text-zinc-400">Qty: {task.quantity} • {task.station} {task.assignedTo && `• ${task.assignedTo}`}</div>
                        </div>
                    </div>
                    <div>
                        <span className={`px-2 py-1 rounded text-xs uppercase ${
                            task.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            task.status === 'in-progress' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-zinc-500/10 text-zinc-500'
                        }`}>{task.status}</span>
                    </div>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default DailyPrepList;
