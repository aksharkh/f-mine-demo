import React, { useState } from 'react';
import { UserCheck, Star, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import { type MysteryReport } from '../../types';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const MOCK_REPORTS: MysteryReport[] = [
    { id: '1', shopperId: 'A001', date: '2024-03-10', scores: { service: 9, food: 8, cleanliness: 10, ambiance: 9 }, comments: 'Great experience, but the music was a bit loud.', totalScore: 90 },
    { id: '2', shopperId: 'B045', date: '2024-03-12', scores: { service: 6, food: 9, cleanliness: 8, ambiance: 7 }, comments: 'Server forgot to refill water. Food was excellent though.', totalScore: 75 },
    { id: '3', shopperId: 'C112', date: '2024-03-14', scores: { service: 10, food: 10, cleanliness: 10, ambiance: 10 }, comments: 'Perfection. Will recommend to everyone.', totalScore: 100 },
];

const MysteryShopper: React.FC = () => {
  const [reports] = useState<MysteryReport[]>(MOCK_REPORTS);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const averageScore = Math.round(reports.reduce((acc, r) => acc + r.totalScore, 0) / reports.length);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setShowSubmitModal(false);
      toast.success('Report Submitted Successfully');
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><UserCheck /> Mystery Shopper Insights</h2>
         <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                 <div className="text-xs text-zinc-500 uppercase font-bold">Network Average</div>
                 <div className={`text-2xl font-black ${averageScore >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>{averageScore}%</div>
             </div>
             <Button onClick={() => setShowSubmitModal(true)}>Submit Report</Button>
         </div>
      </div>

       {showSubmitModal && (
           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
               <div className="bg-[#1a1a1a] w-full max-w-md p-6 rounded-2xl border border-white/10 space-y-4">
                   <h3 className="text-xl font-bold text-white">New Shopper Report</h3>
                   <form onSubmit={handleSubmit} className="space-y-4">
                       <label className="block text-sm text-zinc-400">Date <input type="date" className="w-full bg-black border border-white/10 rounded p-2 text-white mt-1"/></label>
                       <label className="block text-sm text-zinc-400">Location ID <input type="text" className="w-full bg-black border border-white/10 rounded p-2 text-white mt-1"/></label>
                       <label className="block text-sm text-zinc-400">Overall Score (0-100) <input type="number" className="w-full bg-black border border-white/10 rounded p-2 text-white mt-1"/></label>
                       <label className="block text-sm text-zinc-400">Comments <textarea className="w-full bg-black border border-white/10 rounded p-2 text-white mt-1 h-24"></textarea></label>
                       <div className="flex gap-2 pt-2">
                           <Button type="submit" className="flex-1">Submit</Button>
                           <Button type="button" variant="outline" className="flex-1" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       <div className="grid grid-cols-1 gap-6">
           {reports.map(report => (
               <div key={report.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 relative overflow-hidden group">
                   {report.totalScore >= 95 && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1"><Star size={10} fill="black"/> TOP RATED</div>}
                   
                   <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                        <div>
                             <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                 Visit Report <span className="text-zinc-500 font-mono text-sm">#{report.id}</span>
                             </h3>
                             <div className="text-zinc-500 text-sm flex items-center gap-2">
                                 <span>{report.date}</span> • <span>Shopper {report.shopperId}</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-xs text-zinc-500 uppercase">Total Score</div>
                                <div className={`text-3xl font-black ${report.totalScore >= 90 ? 'text-green-400' : report.totalScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {report.totalScore}%
                                </div>
                            </div>
                        </div>
                   </div>

                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                       <ScoreCard label="Service" score={report.scores.service} />
                       <ScoreCard label="Food" score={report.scores.food} />
                       <ScoreCard label="Cleanliness" score={report.scores.cleanliness} />
                       <ScoreCard label="Ambiance" score={report.scores.ambiance} />
                   </div>

                   <div className="bg-white/5 p-4 rounded-lg border border-white/5 relative">
                        <div className="text-xs text-zinc-500 uppercase font-bold mb-2 flex items-center gap-2">
                            {report.totalScore < 80 ? <AlertTriangle size={12} className="text-yellow-500"/> : <CheckCircle size={12} className="text-green-500"/>}
                            Shopper Comments
                        </div>
                        <p className="text-zinc-300 italic">"{report.comments}"</p>
                        <div className="mt-3 flex justify-end">
                             <Button variant="outline" className="text-xs h-6 py-0 border-white/10 text-zinc-400 hover:text-white"><Mail size={10} className="mr-1"/> Contact Shopper</Button>
                        </div>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

const ScoreCard: React.FC<{label: string, score: number}> = ({ label, score }) => (
    <div className="bg-black p-4 rounded-lg border border-zinc-800 text-center transition hover:border-zinc-700">
        <div className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">{label}</div>
        <div className={`text-xl font-bold flex items-center justify-center gap-1 ${score >= 9 ? 'text-green-400' : score >= 7 ? 'text-yellow-400' : 'text-red-400'}`}>
            <span>{score}</span><span className="text-zinc-600 text-sm">/10</span>
        </div>
        {/* Tiny Bar Chart */}
        <div className="h-1 w-12 mx-auto bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className={`h-full ${score >= 9 ? 'bg-green-500' : score >= 7 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${score * 10}%`}}></div>
        </div>
    </div>
);

export default MysteryShopper;
