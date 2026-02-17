import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { type Message } from '../../types';
import Button from '../ui/Button';

const MOCK_MESSAGES: Message[] = [
  { id: '1', sender: 'Manager Sarah', text: 'Welcome team! Dinner service starts at 6pm.', timestamp: '14:30', category: 'general' },
  { id: '2', sender: 'Chef Gordon', text: '86 Salmon for tonight.', timestamp: '15:45', category: 'urgent' },
];

const StaffMessaging: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, {
        id: Date.now().toString(),
        sender: 'You',
        text: input,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general'
    }]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
       <div className="p-4 border-b border-white/10 flex items-center justify-between">
         <h2 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare /> Team Chat</h2>
         <span className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 5 Online</span>
       </div>

       <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    <div className="text-xs text-zinc-500 mb-1 px-2">{msg.sender} • {msg.timestamp}</div>
                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                        msg.sender === 'You' ? 'bg-primary text-white rounded-br-none' : 
                        msg.category === 'urgent' ? 'bg-red-500/20 text-red-200 border border-red-500/30 rounded-bl-none' :
                        'bg-zinc-800 text-white rounded-bl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
       </div>

       <div className="p-4 bg-zinc-900 border-t border-white/10 flex gap-2">
            <input 
                type="text" 
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/30"
                placeholder="Type a message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}><Send size={18} /></Button>
       </div>
    </div>
  );
};

export default StaffMessaging;
