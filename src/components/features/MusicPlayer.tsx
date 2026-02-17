import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, ListMusic, Volume2, Mic2 } from 'lucide-react';
import { type Track } from '../../types';
import { toast } from 'react-hot-toast';

const MOCK_TRACK: Track = {
    id: '1', title: 'Midnight Jazz High', artist: 'The Smooth Trio', duration: '3:45', albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300'
};

const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(MOCK_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress] = useState(45);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    toast(isPlaying ? 'Music Paused' : 'Playing: Midnight Jazz', {
        icon: isPlaying ? '⏸️' : '▶️',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  const changePlaylist = (name: string) => {
      toast.success(`Playlist switched to: ${name}`);
      // Mock track change
      setCurrentTrack({ ...currentTrack, title: `${name} Essentials` });
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Music /> Ambiance Control</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Now Playing */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/60 to-black rounded-2xl border border-white/10 p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
                {/* Background visualizer effect */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sound-waves.png')]"></div>
                
                <div className="relative z-10 group-hover:scale-105 transition duration-500">
                    <img src={currentTrack.albumArt} alt="Album Art" className={`w-48 h-48 rounded-lg shadow-2xl object-cover ${isPlaying ? 'animate-pulse-slow' : ''}`} />
                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">LIVE</div>
                </div>
                
                <div className="flex-1 w-full text-center md:text-left space-y-6 relative z-10">
                    <div>
                        <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{currentTrack.title}</h3>
                        <p className="text-indigo-300 text-xl font-medium flex items-center justify-center md:justify-start gap-2"><Mic2 size={18}/> {currentTrack.artist}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden cursor-pointer">
                            <div className="bg-indigo-500 h-full relative" style={{width: `${progress}%`}}>
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 font-mono">
                            <span>1:45</span>
                            <span>{currentTrack.duration}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-6">
                        <button className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition"><SkipBack size={24}/></button>
                        <button 
                            onClick={togglePlay}
                            className="p-5 bg-white text-black rounded-full hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition duration-300 flex items-center justify-center"
                        >
                            {isPlaying ? <Pause fill="black" size={28} /> : <Play fill="black" className="ml-1" size={28} />}
                        </button>
                        <button className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition"><SkipForward size={24}/></button>
                        
                        <div className="flex items-center gap-2 ml-4 group/vol">
                            <Volume2 size={18} className="text-zinc-400 group-hover/vol:text-white"/>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={volume} 
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Playlists */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 flex flex-col h-full">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ListMusic size={16}/> Curated Zones</h3>
                 <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                     {[
                         { name: 'Dinner Jazz', desc: 'Smooth instrumental background', active: true }, 
                         { name: 'Upbeat Brunch', desc: 'Sunny vibes and vocals', active: false }, 
                         { name: 'Lounge Evening', desc: 'Deep house & chill', active: false }, 
                         { name: 'Cleaning Mode', desc: 'High energy pop', active: false },
                         { name: 'Romantic Night', desc: 'Acoustic covers', active: false }
                     ].map((list, i) => (
                         <div 
                            key={i} 
                            onClick={() => changePlaylist(list.name)}
                            className={`p-4 rounded-lg flex justify-between items-center cursor-pointer transition-all border ${list.active ? 'bg-indigo-900/20 text-indigo-300 border-indigo-500/30 shadow-lg' : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                         >
                             <div>
                                 <div className="font-bold text-sm">{list.name}</div>
                                 <div className="text-xs opacity-60">{list.desc}</div>
                             </div>
                             {list.active && <div className="flex gap-1">
                                 <div className="w-1 h-3 bg-indigo-400 animate-music-bar-1"></div>
                                 <div className="w-1 h-3 bg-indigo-400 animate-music-bar-2"></div>
                                 <div className="w-1 h-3 bg-indigo-400 animate-music-bar-3"></div>
                             </div>}
                         </div>
                     ))}
                 </div>
            </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
