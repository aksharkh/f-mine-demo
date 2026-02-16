import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface FeedbackData {
  rating: number;
  comment: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (data: FeedbackData) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmitFeedback }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmitFeedback({ rating, comment });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-center">
      <h2 className="text-2xl font-serif text-white mb-2">How was your meal?</h2>
      <p className="text-white/40 text-sm mb-6">Help us improve the experience.</p>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
            <Star size={32} fill={star <= rating ? "#d94e28" : "none"} className={star <= rating ? "text-[#d94e28]" : "text-white/20"} />
          </button>
        ))}
      </div>
      <textarea 
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
        placeholder="Any comments?" 
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d94e28] h-24 mb-4 resize-none" 
      />
      <Button onClick={handleSubmit} className="w-full">Submit Feedback</Button>
    </Modal>
  );
};

export default FeedbackModal;
