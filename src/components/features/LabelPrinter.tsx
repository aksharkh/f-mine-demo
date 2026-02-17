import React, { useState } from 'react';
import { Printer, Tag, Coffee, Check } from 'lucide-react';
import { type LabelTemplate } from '../../types';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const MOCK_TEMPLATES: LabelTemplate[] = [
    { id: '1', name: 'Standard Coffee Cup', width: 50, height: 30, fields: ['Item', 'Modifiers'] },
    { id: '2', name: 'Delivery Bag', width: 80, height: 100, fields: ['Order ID', 'Items', 'Customer'] },
];

const LabelPrinter: React.FC = () => {
  const [templates] = useState<LabelTemplate[]>(MOCK_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState('1');
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
      setIsPrinting(true);
      const toastId = toast.loading('Sending to Thermal Printer...');
      setTimeout(() => {
          setIsPrinting(false);
          toast.success('Print Job Complete', { id: toastId });
      }, 2000);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-white flex items-center gap-2"><Printer /> Label Printer Config</h2>
         <Button onClick={handlePrint} disabled={isPrinting}>
             {isPrinting ? 'Printing...' : 'Test Print Active Template'}
         </Button>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Settings */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6">
                <h3 className="text-zinc-400 mb-4 flex items-center gap-2"><Tag size={16}/> Templates</h3>
                <div className="space-y-3">
                    {templates.map(t => (
                        <div 
                            key={t.id} 
                            onClick={() => setActiveTemplate(t.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition flex justify-between items-center ${activeTemplate === t.id ? 'bg-white/10 border-white/50' : 'bg-white/5 border-white/5'}`}
                        >
                            <div>
                                <div className="text-white font-medium">{t.name}</div>
                                <div className="text-xs text-zinc-500">{t.width}mm x {t.height}mm</div>
                            </div>
                            {activeTemplate === t.id && <div className="flex items-center gap-2 text-green-400 text-xs font-bold"><Check size={12}/> Active</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center bg-grid-white/[0.02] relative">
                 <h3 className="text-zinc-400 mb-8 w-full text-center">Live Preview</h3>
                 
                 <div className={`bg-white text-black p-4 rounded shadow-2xl font-mono text-sm max-w-xs w-full rotate-1 transform transition-all duration-500 ${isPrinting ? 'translate-y-[200px] opacity-0' : 'translate-y-0 opacity-100'}`}>
                     <div className="flex items-center justify-center gap-2 border-b-2 border-black pb-2 mb-2 font-bold text-center">
                        <Coffee size={20} /> Kitchen OS
                     </div>
                     
                     <div className="text-xl font-black mb-1">Oat Flat White</div>
                     <ul className="text-xs space-y-1 mb-4">
                        <li>- Extra Hot</li>
                        <li>- 2 Sugars</li>
                     </ul>

                     <div className="flex justify-between items-end pt-2 border-t border-black border-dashed">
                        <div>
                            <div className="text-[10px] uppercase">Order #420</div>
                            <div className="text-[10px]">10:42 AM</div>
                        </div>
                        <div className="font-bold text-lg">Jame</div>
                     </div>
                 </div>
                 
                 {/* Printer Slot Graphic */}
                 <div className="absolute bottom-0 w-64 h-2 bg-black rounded-full shadow-[0_0_20px_black]"></div>
            </div>
        </div>
    </div>
  );
};

export default LabelPrinter;
