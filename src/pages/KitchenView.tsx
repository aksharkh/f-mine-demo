import React, { useState, useMemo, useEffect } from 'react';
import { 
  Volume2, VolumeX, Bike, Zap, PartyPopper, AlertTriangle, GlassWater, Utensils, Bell, 
  X, Truck, Trash2, TrendingUp, PauseCircle, Megaphone, FileBarChart, Calendar, ListChecks,
  Minus, Plus
} from 'lucide-react';
import { type Order, type Staff, type Reservation, type MenuItem } from '../types';
import { MENU_ITEMS } from '../lib/constants';
import Button from '../components/ui/Button';
import KitchenOrderCard from '../components/features/KitchenOrderCard';
import KitchenPass from '../components/features/KitchenPass';
import TeamManagement from '../components/features/TeamManagement';
import ReceiptModal from '../components/modals/ReceiptModal';
import RecipeModal from '../components/modals/RecipeModal';
import EODReportModal from '../components/modals/EODReportModal';
import HACCPModal from '../components/modals/HACCPModal';
import SupplierOrderModal from '../components/modals/SupplierOrderModal';

interface KitchenViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: any, prepTime?: number | null, voidReason?: string | null) => void;
  alerts: any[];
  onDismissAlert: (id: string) => void;
  availability: Record<string, { stock: number }>;
  onUpdateStock: (itemId: string, newStock: number) => void;
  onCreateOrder: (cart: any[], tableId: string) => void; 
  busyMode: boolean;
  setBusyMode: (busy: boolean) => void;
  reservations: Reservation[];
  staff: Staff[];
  onToggleStaffStatus: (id: string, active: boolean) => void;
  happyHour: boolean;
  onToggleHappyHour: (active: boolean) => void;
  onSetAnnouncement: (text: string) => void;
  onCallTable: (tableId: string, msg: string) => void;
  surgePricing: boolean;
  onToggleSurge: (active: boolean) => void;
  deliveryMode: boolean;
  setDeliveryMode: (active: boolean) => void;
}

const KitchenView: React.FC<KitchenViewProps> = ({ 
  orders, 
  onUpdateStatus, 
  alerts, 
  onDismissAlert, 
  availability, 
  onUpdateStock, 
  // onCreateOrder, 
  busyMode, 
  setBusyMode, 
  reservations, 
  staff, 
  onToggleStaffStatus, 
  happyHour, 
  onToggleHappyHour, 
  onSetAnnouncement, 
  onCallTable, 
  surgePricing, 
  onToggleSurge, 
  deliveryMode, 
  setDeliveryMode 
}) => {
  const [tab, setTab] = useState('orders');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [recipeItem, setRecipeItem] = useState<any | null>(null);
  const [showEOD, setShowEOD] = useState(false);
  const [showHACCP, setShowHACCP] = useState(false);
  const [announcementInput, setAnnouncementInput] = useState("");
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((acc, o) => acc + o.total, 0);
    const activeOrders = orders.filter(o => o.status !== 'served' && o.status !== 'cancelled').length;
    return { totalOrders, revenue, activeOrders };
  }, [orders]);

  const tableStatus = useMemo(() => {
    const status: Record<string, string> = {};
    const waitTimes: Record<string, number> = {};
    for (let i = 1; i <= 12; i++) { status[i.toString()] = 'free'; waitTimes[i.toString()] = 0; }
    orders.forEach(o => { 
      if (o.status !== 'served' && o.status !== 'cancelled') {
        const tId = o.tableId.toString();
        status[tId] = o.status === 'pending' ? 'pending' : 'occupied'; 
        const createdAt = o.createdAt instanceof Date 
            ? o.createdAt 
            : (o.createdAt as any)?.toDate 
            ? (o.createdAt as any).toDate() 
            : new Date();
        const mins = (new Date().getTime() - createdAt.getTime()) / 60000;
        if (mins > (waitTimes[tId] || 0)) waitTimes[tId] = mins;
      }
    });
    alerts.forEach(a => status[a.tableId] = 'alert');
    return { status, waitTimes };
  }, [orders, alerts]);

  // Audio effect
  useEffect(() => {
    if (audioEnabled && orders.some(o => o.status === 'pending')) {
      console.log("Beep!");
    }
  }, [orders, audioEnabled]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
         if (o.status === 'served' || o.status === 'cancelled') return false;
         if (!deliveryMode && o.delivery) return false;
         return true;
      })
      .sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as any).seconds * 1000;
        const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as any).seconds * 1000;
        return timeA - timeB; 
      });
  }, [orders, deliveryMode]);

  const hourlySales = [45, 120, 300, 220, 180, 400, 350, 150];
  const maxSale = Math.max(...hourlySales);
  const lowStockItems = useMemo(() => MENU_ITEMS.filter((i: MenuItem) => (availability[i.id]?.stock ?? 20) < 5).map((i: MenuItem) => ({...i, currentStock: availability[i.id]?.stock})), [availability]);
  const wasteStats = useMemo(() => [{name:'Milk', val:20}, {name:'Coffee', val:15}, {name:'Bread', val:10}], []); 

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      
      {lowStockItems.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-red-900/50 backdrop-blur-md text-red-100 z-50 h-8 flex items-center overflow-hidden border-b border-red-500/20">
           <div className="animate-ticker whitespace-nowrap flex gap-8 px-4 text-xs font-bold font-mono uppercase tracking-widest">
              {lowStockItems.map((item: any) => <span key={item.id} className="flex items-center gap-2"><AlertTriangle size={12}/> LOW STOCK: {item.name} ({item.currentStock})</span>)}
              {lowStockItems.map((item: any) => <span key={`dup-${item.id}`} className="flex items-center gap-2"><AlertTriangle size={12}/> LOW STOCK: {item.name} ({item.currentStock})</span>)}
           </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between mb-10 border-b border-white/10 pb-6 max-w-[1800px] mx-auto gap-4 mt-8">
        <div>
            <h1 className="text-4xl font-serif text-white mb-2">Kitchen OS <span className="text-[#d94e28] text-sm align-top">v2.0</span></h1>
            <p className="text-white/40 font-mono text-sm">Pass Active • {stats.activeOrders} Orders Pending</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <button onClick={() => setAudioEnabled(!audioEnabled)} className={`p-3 rounded-full transition-colors ${audioEnabled ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white/40'}`}>{audioEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}</button>
           <button onClick={() => setDeliveryMode(!deliveryMode)} className={`p-3 rounded-full transition-colors ${deliveryMode ? 'bg-green-600 text-white' : 'bg-[#1a1a1a] text-white/40'}`} title="Toggle Delivery Orders"><Bike size={20}/></button>
           <button onClick={() => setBusyMode(!busyMode)} className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold border transition-all ${busyMode ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-[#1a1a1a] text-white/40 border-white/10 hover:text-white'}`}><Zap size={18} fill={busyMode ? "currentColor" : "none"} />{busyMode ? "RUSH MODE" : "Busy Mode"}</button>
           <button onClick={() => onToggleHappyHour(!happyHour)} className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold border transition-all ${happyHour ? 'bg-purple-500 text-white border-purple-500' : 'bg-[#1a1a1a] text-white/40 border-white/10 hover:text-white'}`}><PartyPopper size={18} />{happyHour ? "HAPPY HOUR ON" : "Happy Hour"}</button>
           <div className="bg-[#1a1a1a] p-1 rounded-xl flex flex-wrap gap-1 border border-white/10">
               {['orders', 'pass', 'team', 'tables', 'prep', 'menu', 'stats'].map(t => (
                   <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors uppercase tracking-wider ${tab === t ? 'bg-[#d94e28] text-white' : 'text-white/40 hover:text-white'}`}>
                       {t === 'pass' ? 'The Pass' : t}
                   </button>
               ))}
            </div>
        </div>
      </header>
      <main className="max-w-[1800px] mx-auto space-y-8 animate-in fade-in duration-500">
        {tab === 'orders' && (
          <>
            {alerts.length > 0 && <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top">{alerts.map(alert => <div key={alert.id} className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 flex items-center justify-between animate-pulse"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">{alert.type === 'water' ? <GlassWater size={20}/> : alert.type === 'cutlery' ? <Utensils size={20}/> : <Bell size={20}/>}</div><div><h3 className="font-bold text-white">Table {alert.tableId}</h3><p className="text-red-400 text-xs uppercase font-bold">{alert.type}</p></div></div><button onClick={() => onDismissAlert(alert.id)}><X size={20}/></button></div>)}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">{filteredOrders.map(order => <KitchenOrderCard key={order.id} order={order} onUpdateStatus={onUpdateStatus} onViewReceipt={setReceiptOrder} onShowRecipe={setRecipeItem} onQuickStockOut={(id: string) => onUpdateStock(id, 0)} />)}</div>
          </>
        )}
        {tab === 'pass' && <KitchenPass orders={orders} onUpdateStatus={onUpdateStatus} />}
        {tab === 'team' && <TeamManagement staff={staff} onToggleStatus={onToggleStaffStatus} />}
        {tab === 'prep' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#161616] p-6 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-serif mb-4 flex items-center gap-2"><ListChecks/> Opening Checklist</h3>
                 <div className="space-y-2">{['Turn on ovens', 'Check fridge temp', 'Brew drip coffee', 'Count cash drawer', 'Stock napkins'].map((task, i) => <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"><div className="w-5 h-5 border border-white/20 rounded cursor-pointer hover:bg-[#d94e28]"></div><span>{task}</span></div>)}</div>
                 <Button onClick={() => setShowHACCP(true)} className="mt-4 w-full bg-blue-600">Log Temperatures</Button>
              </div>
              <div className="bg-[#161616] p-6 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-serif mb-4 flex items-center gap-2"><ListChecks/> Closing Checklist</h3>
                 <div className="space-y-2">{['Wipe down surfaces', 'Sweep floors', 'Turn off espresso machine', 'Label prep', 'Take out trash'].map((task, i) => <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"><div className="w-5 h-5 border border-white/20 rounded cursor-pointer hover:bg-[#d94e28]"></div><span>{task}</span></div>)}</div>
              </div>
           </div>
        )}
        {tab === 'tables' && (
          <div className="flex gap-8">
             <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.keys(tableStatus.status).map(tId => {
                const status = tableStatus.status[tId];
                const waitTime = tableStatus.waitTimes[tId];
                let color = 'bg-green-500/10 border-green-500/30';
                if (status === 'alert') color = 'bg-red-500/20 border-red-500 animate-pulse';
                else if (status === 'occupied' || status === 'pending') {
                   if (waitTime > 20) color = 'bg-red-500/20 border-red-500';
                   else if (waitTime > 10) color = 'bg-orange-500/20 border-orange-500';
                   else color = 'bg-green-500/20 border-green-500';
                }
                return (<div key={tId} className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative transition-colors ${color}`}><div className="text-4xl font-serif font-bold">{tId}</div><div className="absolute bottom-4 uppercase text-xs font-bold opacity-60">{status}</div>{waitTime > 0 && <div className="absolute top-2 right-2 text-xs font-mono">{waitTime.toFixed(0)}m</div>}{status !== 'free' && <button onClick={() => onCallTable(tId, 'ready')} className="absolute -bottom-3 bg-white text-black text-[10px] px-2 py-1 rounded-full shadow-lg font-bold hover:bg-gray-200">CALL</button>}</div>)
              })}
             </div>
             <div className="w-80 bg-[#161616] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-serif mb-4 flex items-center gap-2"><Calendar size={20}/> Reservations</h3>
                <div className="space-y-4">{reservations.length === 0 ? <p className="text-white/40 text-sm">No upcoming reservations.</p> : reservations.map((res, i) => <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10"><div className="flex justify-between items-center mb-1"><span className="font-bold">{res.time}</span><span className="text-xs bg-[#d94e28] px-2 py-0.5 rounded text-white">{res.partySize} ppl</span></div><div className="text-sm text-white/60">{res.name}</div></div>)}</div>
             </div>
          </div>
        )}
        {tab === 'menu' && (
          <div className="flex gap-6">
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MENU_ITEMS.map((item: MenuItem) => {
                const stock = availability[item.id]?.stock ?? 20;
                return (
                  <div key={item.id} className="p-6 rounded-2xl border border-white/10 bg-[#161616] flex items-center justify-between">
                    <div className="flex items-center gap-4"><img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt="" /><div><h3 className="font-serif text-lg">{item.name}</h3><p className={`text-xs uppercase font-bold ${stock < 5 ? 'text-red-400' : 'text-green-400'}`}>{stock} Units Remaining</p></div></div>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1"><button onClick={() => onUpdateStock(item.id, Math.max(0, stock - 1))} className="p-2 hover:bg-white/10 rounded text-white"><Minus size={16}/></button><span className="w-8 text-center font-mono">{stock}</span><button onClick={() => onUpdateStock(item.id, stock + 1)} className="p-2 hover:bg-white/10 rounded text-white"><Plus size={16}/></button></div>
                       <button onClick={() => onUpdateStock(item.id, 0)} className="text-xs text-red-400 hover:text-red-300 bg-red-900/20 px-2 py-1 rounded flex items-center justify-center gap-1"><Trash2 size={12}/> Log Waste</button>
                    </div>
                  </div>
                );
              })}
             </div>
             <div className="w-64 space-y-4">
                <Button onClick={() => setSupplierModalOpen(true)} className="w-full h-32 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500"><Truck size={32}/> Restock Report</Button>
                <div className="p-4 bg-[#161616] border border-white/10 rounded-2xl">
                   <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><Trash2 size={16}/> Waste Log (Last 24h)</h4>
                   <div className="space-y-2 text-xs text-white/60">
                      {wasteStats.map((w,i) => <div key={i} className="flex justify-between"><span>{w.name}</span><span>${w.val}</span></div>)}
                   </div>
                </div>
                <div className="p-4 bg-[#161616] border border-white/10 rounded-2xl">
                   <h4 className="text-sm font-bold mb-3">Station Routing</h4>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm"><span>Bar Printer</span><span className="text-green-400">Online</span></div>
                      <div className="flex justify-between items-center text-sm"><span>Hot Pass</span><span className="text-green-400">Online</span></div>
                      <div className="flex justify-between items-center text-sm"><span>Cold Larder</span><span className="text-red-400">Offline</span></div>
                   </div>
                </div>
             </div>
          </div>
        )}
        {tab === 'stats' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
               <div className="flex gap-2">
                 <button onClick={() => onToggleSurge(!surgePricing)} className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold border transition-all ${surgePricing ? 'bg-red-600 text-white border-red-600' : 'bg-[#1a1a1a] text-white/40 border-white/10 hover:text-white'}`}><TrendingUp size={18}/> {surgePricing ? "SURGE PRICING ON" : "Enable Surge Pricing"}</button>
                 <button onClick={() => {if(window.confirm('STOP ALL ORDERS?')) setBusyMode(true)}} className="px-4 py-2 rounded-xl flex items-center gap-2 font-bold border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"><PauseCircle size={18}/> EMERGENCY STOP</button>
               </div>
               <Button onClick={() => setShowEOD(true)} className="bg-white text-black hover:bg-gray-200 gap-2"><FileBarChart size={18}/> End of Day Report</Button>
            </div>
            <div className="bg-[#161616] p-6 rounded-3xl border border-white/10">
               <h3 className="text-sm uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2"><Megaphone size={16}/> Broadcast Announcement</h3>
               <div className="flex gap-2">
                 <input value={announcementInput} onChange={e => setAnnouncementInput(e.target.value)} placeholder="e.g. Kitchen Closing in 15m..." className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white" />
                 <Button onClick={() => onSetAnnouncement(announcementInput)} className="bg-blue-600 hover:bg-blue-500">Send</Button>
                 <Button onClick={() => onSetAnnouncement("")} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">Clear</Button>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-[#161616] p-8 rounded-3xl border border-white/10"><h3 className="text-white/50 text-xs uppercase tracking-widest mb-2">Revenue</h3><div className="text-4xl font-serif">${stats.revenue.toFixed(2)}</div></div>
               <div className="bg-[#161616] p-8 rounded-3xl border border-white/10"><h3 className="text-white/50 text-xs uppercase tracking-widest mb-2">Orders</h3><div className="text-4xl font-serif">{stats.totalOrders}</div></div>
               <div className="bg-[#161616] p-8 rounded-3xl border border-white/10"><h3 className="text-white/50 text-xs uppercase tracking-widest mb-2">Avg Ticket</h3><div className="text-4xl font-serif">${stats.totalOrders ? (stats.revenue / stats.totalOrders).toFixed(2) : '0.00'}</div></div>
            </div>
            <div className="bg-[#161616] p-8 rounded-3xl border border-white/10"><h3 className="text-lg font-serif mb-6 flex items-center gap-2"><TrendingUp size={20} /> Hourly Sales Trend</h3><div className="h-64 flex items-end justify-between gap-4">{hourlySales.map((val, i) => <div key={i} className="flex-1 flex flex-col items-center gap-2 group"><div className="w-full bg-[#d94e28] opacity-50 group-hover:opacity-100 transition-all rounded-t-lg relative" style={{ height: `${(val / maxSale) * 100}%` }}><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">${val}</div></div><div className="text-xs text-white/40 font-mono">{12 + i}:00</div></div>)}</div></div>
          </div>
        )}
      </main>
      <ReceiptModal order={receiptOrder} isOpen={!!receiptOrder} onClose={() => setReceiptOrder(null)} />
      <RecipeModal item={recipeItem} isOpen={!!recipeItem} onClose={() => setRecipeItem(null)} />
      <EODReportModal isOpen={showEOD} onClose={() => setShowEOD(false)} stats={stats} />
      <HACCPModal isOpen={showHACCP} onClose={() => setShowHACCP(false)} onSubmit={() => { setShowHACCP(false); alert("Temps Logged"); }} />
      <SupplierOrderModal isOpen={supplierModalOpen} onClose={() => setSupplierModalOpen(false)} lowStockItems={lowStockItems} />
    </div>
  );
};

export default KitchenView;
