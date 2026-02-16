import React from 'react';
import Modal from '../ui/Modal';

interface TriviaGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const TriviaGame: React.FC<TriviaGameProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-center">
      <h2 className="text-2xl font-serif mb-2">Wait Time Trivia</h2>
      <p className="text-sm text-white/50 mb-6">Question 1: Where does coffee originate?</p>
      <div className="grid grid-cols-2 gap-2">
        {['Brazil', 'Ethiopia', 'Colombia', 'Vietnam'].map(a => (
          <button key={a} className="p-3 bg-white/5 hover:bg-[#d94e28] rounded-xl transition-colors">
            {a}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-4 text-xs text-white/40 underline">Close Game</button>
    </Modal>
  );
};

export default TriviaGame;
