import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { useStore, store } from '../../lib/store';
import Button from '../ui/Button';

const SentimentAnalysisView: React.FC = () => {
  const { sentimentAnalysis } = useStore();
  const [isLive, setIsLive] = useState(false);

  // Simulation Logic
  useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLive) {
            interval = setInterval(() => {
                const sources = ['Google', 'Yelp', 'TripAdvisor', 'Facebook'];
                const comments = [
                    { text: 'Amazing food!', sentiment: 'positive', score: 0.9 },
                    { text: 'Slow service today.', sentiment: 'negative', score: -0.5 },
                    { text: 'It was okay.', sentiment: 'neutral', score: 0.1 },
                    { text: 'Love the ambiance!', sentiment: 'positive', score: 0.8 },
                ];
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                
                store.addSentimentReview({
                    id: Math.random().toString(36).substr(2, 5),
                    source: sources[Math.floor(Math.random() * sources.length)] as any,
                    text: randomComment.text,
                    sentiment: randomComment.sentiment as any,
                    score: randomComment.score,
                    date: 'Just now'
                });
            }, 5000);
        }
        return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><MessageSquare /> Customer Sentiment AI</h2>
         <Button onClick={() => setIsLive(!isLive)} className={isLive ? "bg-green-600 animate-pulse" : ""}>
             {isLive ? "Live Feed Active" : "Start Live Analysis"}
         </Button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Summary Cards */}
           <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
               <div className="text-zinc-500 text-xs uppercase font-bold mb-1">Positive Sentiment</div>
               <div className="text-3xl font-black text-green-500">
                   {Math.round((sentimentAnalysis.filter(s => s.sentiment === 'positive').length / sentimentAnalysis.length) * 100)}%
               </div>
           </div>
           <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
               <div className="text-zinc-500 text-xs uppercase font-bold mb-1">Review Volume</div>
               <div className="text-3xl font-black text-white">{sentimentAnalysis.length}</div>
           </div>
           <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
               <div className="text-zinc-500 text-xs uppercase font-bold mb-1">Avg Score</div>
               <div className="text-3xl font-black text-blue-400">
                   {(sentimentAnalysis.reduce((acc, curr) => acc + curr.score, 0) / sentimentAnalysis.length).toFixed(2)}
               </div>
           </div>
       </div>

       <div className="space-y-4">
           <h3 className="text-white font-bold">Recent Reviews Feed</h3>
           {sentimentAnalysis.map(review => (
               <div key={review.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 flex gap-4 transition hover:bg-white/5">
                   <div className={`mt-1 p-2 rounded-full h-fit flex-shrink-0 ${
                       review.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                       review.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                       'bg-zinc-500/20 text-zinc-400'
                   }`}>
                       {review.sentiment === 'positive' ? <ThumbsUp size={16}/> :
                        review.sentiment === 'negative' ? <ThumbsDown size={16}/> :
                        <Minus size={16}/>}
                   </div>
                   
                   <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                           <div className="text-white font-medium">{review.source} Review</div>
                           <div className="text-zinc-500 text-xs">{review.date}</div>
                       </div>
                       <p className="text-zinc-300 text-sm leading-relaxed">"{review.text}"</p>
                       <div className="mt-2 flex gap-2">
                           <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded text-zinc-500">AI Score: {review.score}</span>
                       </div>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default SentimentAnalysisView;
