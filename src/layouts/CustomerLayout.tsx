import React from 'react';
import { Settings } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

const CustomerLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-black transition-colors duration-300">
            {/* Main Content */}
            <Outlet />

            {/* Dev Toggle Helper - Floating Buttons */}
             <div className="fixed bottom-4 right-4 z-[60] flex gap-2">
                <button onClick={() => navigate('/admin')} className="bg-black/50 text-white p-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-all" title="Go to Admin"><Settings size={20} /></button>
             </div>
        </div>
    );
};

export default CustomerLayout;
