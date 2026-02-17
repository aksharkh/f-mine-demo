import React from 'react';
import { 
  ShoppingBag, ChartBar, Map, Clipboard, Users, Calendar, DollarSign, LogOut,
  ChefHat
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Helper to determine active state
    const isActive = (path: string) => location.pathname.includes(path);

    return (
        <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-20 bg-[#121212] border-r border-white/10 flex flex-col items-center py-6 gap-6 z-50 overflow-y-auto h-full scrollbar-hide">
                <div onClick={() => navigate('/admin')} className="p-3 bg-[#d94e28] rounded-xl cursor-pointer shadow-lg shadow-orange-500/20 mb-4">
                    <ChefHat size={24} className="text-white"/>
                </div>

                <button onClick={() => navigate('/admin/kitchen')} className={`p-2 rounded-xl transition-all ${isActive('kitchen') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="KDS"><Clipboard/></button>
                <button onClick={() => navigate('/admin/floor')} className={`p-2 rounded-xl transition-all ${isActive('floor') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Floor Plan"><Map/></button>
                <button onClick={() => navigate('/admin/analytics')} className={`p-2 rounded-xl transition-all ${isActive('analytics') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Analytics"><ChartBar/></button>
                <button onClick={() => navigate('/admin/menu')} className={`p-2 rounded-xl transition-all ${isActive('menu') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Menu Editor"><ShoppingBag/></button>
                <button onClick={() => navigate('/admin/inventory')} className={`p-2 rounded-xl transition-all ${isActive('inventory') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Inventory"><DollarSign/></button>
                <button onClick={() => navigate('/admin/staff')} className={`p-2 rounded-xl transition-all ${isActive('staff') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Staff"><Users/></button>
                <button onClick={() => navigate('/admin/reservations')} className={`p-2 rounded-xl transition-all ${isActive('reservations') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Reservations"><Calendar/></button>
                
                <div className="w-8 h-[1px] bg-white/10 my-2"></div>
                
                {/* Scrollable list of other features */}
                <div className="flex flex-col gap-6 w-full items-center">
                    <button onClick={() => navigate('/admin/kiosk')} className={`p-2 rounded-xl transition-all ${isActive('kiosk') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Kiosk Mode"><ShoppingBag size={18}/></button>
                    <button onClick={() => navigate('/admin/dispatch')} className={`p-2 rounded-xl transition-all ${isActive('dispatch') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Driver Dispatch"><Map size={18}/></button>
                    <button onClick={() => navigate('/admin/recipe')} className={`p-2 rounded-xl transition-all ${isActive('recipe') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Recipe Costing"><DollarSign size={18}/></button>
                    
                    {/* ... Adding a few more key ones, avoiding cluttering too much but ensuring accessible ... */}
                    <button onClick={() => navigate('/admin/loyalty')} className={`p-2 rounded-xl transition-all ${isActive('loyalty') ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`} title="Loyalty"><Users size={18}/></button>
                </div>

                <div className="mt-auto flex flex-col gap-4 pb-4">
                     <button onClick={() => navigate('/')} className="p-2 rounded-xl text-white/40 hover:text-white" title="Customer View"><LogOut/></button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-[#0f0f0f] p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
