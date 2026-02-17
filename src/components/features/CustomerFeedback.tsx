import React, { useState } from 'react';
import { Star, MessageSquare, Plus, X } from 'lucide-react';
import { useStore, store } from '../../lib/store';

import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const CustomerFeedback: React.FC = () => {
  const { feedbacks } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: '', tags: '' });

  const avgRating = feedbacks.length 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      store.addFeedback({
          id: Math.random().toString(36).substr(2, 5),
          rating: newFeedback.rating,
          comment: newFeedback.comment,
          date: new Date().toLocaleDateString(),
          tags: newFeedback.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setShowForm(false);
      setNewFeedback({ rating: 5, comment: '', tags: '' });
      toast.success('Feedback Submitted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><MessageSquare /> Customer Feedback</h2>
         <Button onClick={() => setShowForm(!showForm)}>
             {showForm ? <X size={18}/> : <Plus size={18} className="mr-2"/>}
             {showForm ? 'Cancel' : 'Add Manual Review'}
         </Button>
      </div>

      {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-4 space-y-4">
              <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Rating</label>
                  <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                          <button 
                            key={star} 
                            type="button"
                            onClick={() => setNewFeedback({...newFeedback, rating: star})}
                            className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                          >
                            <Star size={32} fill={star <= newFeedback.rating ? "#fbbf24" : "transparent"} className={star <= newFeedback.rating ? "text-yellow-400" : "text-zinc-600"} />
                          </button>
                      ))}
                  </div>
              </div>
              <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Comment</label>
                  <textarea 
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white h-24"
                    value={newFeedback.comment}
                    onChange={e => setNewFeedback({...newFeedback, comment: e.target.value})}
                    placeholder="Enter customer feedback..."
                    required
                  />
              </div>
              <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Tags (comma separated)</label>
                  <input 
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                    value={newFeedback.tags}
                    onChange={e => setNewFeedback({...newFeedback, tags: e.target.value})}
                    placeholder="Food, Service, Ambiance..."
                  />
              </div>
              <Button type="submit" variant="primary">Submit Feedback</Button>
          </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overview Card */}
        <div className="bg-gradient-to-br from-[#d94e28] to-orange-700 rounded-xl p-6 text-white md:col-span-1 shadow-lg shadow-orange-900/20">
            <h3 className="text-white/80 font-medium mb-1">Average Rating</h3>
            <div className="text-6xl font-black mb-4 tracking-tighter">{avgRating}</div>
            <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(star => (
                    <Star key={star} size={24} fill={star <= Number(avgRating) ? "white" : "white"} className={`text-white ${star <= Number(avgRating) ? 'opacity-100' : 'opacity-30'}`} />
                ))}
            </div>
            <p className="text-sm border-t border-white/20 pt-4 opacity-90">{feedbacks.length} verified reviews total</p>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-3 space-y-4">
            {feedbacks.map(item => (
                <div key={item.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                                <Star key={star} size={16} fill={star <= item.rating ? "#fbbf24" : "transparent"} className={star <= item.rating ? "text-yellow-400" : "text-zinc-700"} />
                            ))}
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">{item.date}</span>
                    </div>
                    <p className="text-white text-lg">"{item.comment}"</p>
                    <div className="flex gap-2 mt-2">
                        {item.tags?.map((tag, i) => (
                            <span key={i} className="text-[10px] lowercase px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">#{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedback;
