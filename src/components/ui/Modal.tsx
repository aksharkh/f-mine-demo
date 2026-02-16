import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className,
  showCloseButton = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "relative bg-[#1a1a1a] border border-white/20 text-white p-6 w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in duration-300", 
        className
      )}>
        {showCloseButton && (
           <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
             <X size={20}/>
           </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
