import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Features (Admin)
import KitchenView from './pages/KitchenView';
import FloorPlan from './components/features/FloorPlan';
import AnalyticsDashboard from './components/features/AnalyticsDashboard';
import MenuEditor from './components/features/MenuEditor';
import InventoryManager from './components/features/InventoryManager';
import ShiftCalendar from './components/features/ShiftCalendar';
import ReservationCalendar from './components/features/ReservationCalendar';
import LoyaltyCard from './components/features/LoyaltyCard';
import KioskMode from './components/features/KioskMode';
import DriverDispatch from './components/features/DriverDispatch';
import RecipeCosting from './components/features/RecipeCosting';
import TemperatureLog from './components/features/TemperatureLog';
import HaccpLog from './components/features/HaccpLog';
import StaffTimeClock from './components/features/StaffTimeClock';
import TipDistribution from './components/features/TipDistribution';
import CustomerFeedback from './components/features/CustomerFeedback';
import TurnoverHeatmap from './components/features/TurnoverHeatmap';
import WasteTracking from './components/features/WasteTracking';
import DailyPrepList from './components/features/DailyPrepList';
import PurchaseOrders from './components/features/PurchaseOrders';
import LocationManager from './components/features/LocationManager';
import DarkKitchen from './components/features/DarkKitchen';
import AllergenMatrix from './components/features/AllergenMatrix';
import NutritionalCalc from './components/features/NutritionalCalc';
import StaffMessaging from './components/features/StaffMessaging';
import Digital86Board from './components/features/Digital86Board';
import VipAlerts from './components/features/VipAlerts';
import EventManagement from './components/features/EventManagement';
import AiForecast from './components/features/AiForecast';
import SmartRoster from './components/features/SmartRoster';
import KdsBumpBar from './components/features/KdsBumpBar';
import CustomerDisplay from './components/features/CustomerDisplay';
import LabelPrinter from './components/features/LabelPrinter';
import DeliveryAggregator from './components/features/DeliveryAggregator';
import ValetTracker from './components/features/ValetTracker';
import LostFoundLog from './components/features/LostFoundLog';
import MusicPlayer from './components/features/MusicPlayer';
import LightingControl from './components/features/LightingControl';
import DigitalSommelier from './components/features/DigitalSommelier';
import CharcuterieBuilder from './components/features/CharcuterieBuilder';
import CateringManagement from './components/features/CateringManagement';
import FranchiseDashboard from './components/features/FranchiseDashboard';
import MysteryShopper from './components/features/MysteryShopper';
import MaintenanceLogView from './components/features/MaintenanceLog';
import RefundManager from './components/features/RefundManager';
import VendorScorecardView from './components/features/VendorScorecard';
import SentimentAnalysisView from './components/features/SentimentAnalysis';
import StaffGamification from './components/features/StaffGamification';

// Customer
import CustomerView from './pages/CustomerView';
import CartDrawer from './components/features/CartDrawer';

// Store & Utils
import { useStore, store } from './lib/store';
import { cn } from './lib/utils';
import { type Order, type CartItem } from './types';
import useSound from './hooks/useSound';

function App() {
  const { 
    menuItems, staff: storeStaff, reservations
  } = useStore(); 
  
  // Local state for App-level settings 
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [announcement, setAnnouncement] = useState("");
  const [happyHour, setHappyHour] = useState(false);
  const [surgePricing, setSurgePricing] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState(true);
  
  // Cart State 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useStore();
  const playSound = useSound();

  // Temporary availability mock until full inventory integration in CustomerView
  const [availability, setAvailability] = useState<Record<string, { stock: number }>>({});

  useEffect(() => {
    // Sync initial stock
    const initialStock: Record<string, { stock: number }> = {};
    menuItems.forEach(item => { initialStock[item.id] = { stock: 20 }; });
    setAvailability(initialStock);
  }, [menuItems]);

  // Handler helpers
  const handleAddToCart = (item: CartItem) => {
      store.addToCart(item);
      setIsCartOpen(true);
      playSound('success');
  };

  const placeOrder = (total: number, isPriority: boolean = false, scheduledTime: string = "") => {
    if (cart.length === 0) return;
    
    // Get tableId from somewhere, for now hardcoded or passed from view
    // In a real app, this might come from the URL param
    const tableId = '4'; 

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user-1',
      tableId,
      items: [...cart],
      status: 'pending',
      total,
      createdAt: new Date(),
      isPriority,
      scheduledTime,
      delivery: false
    };
    
    store.addKitchenOrder(newOrder); 
    store.clearCart();
    setIsCartOpen(false);
    playSound('notification');
    toast.success('Order placed successfully!');
    
    // Decrease stock mock
    const newAvailability = { ...availability };
    cart.forEach(item => {
      if (newAvailability[item.id]) {
        newAvailability[item.id] = { 
          stock: Math.max(0, newAvailability[item.id].stock - item.quantity) 
        };
      }
    });
    setAvailability(newAvailability);
  };


  const handleRemoveFromCart = (index: number) => {
      store.removeFromCart(index);
  };
  
  const handleUpdateStock = (id: string, val: number) => {
      setAvailability(prev => ({ ...prev, [id]: { stock: val } }));
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300", theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#f4f4f5] text-black')}>
      <Toaster position="top-center" />
      
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
             <Route index element={
                 <CustomerView 
                    user={null}
                    onPlaceOrder={(items) => items.forEach(handleAddToCart)} 
                    tableId={'4'} // Default
                    activeOrder={null} 
                    onCallWaiter={(type) => toast(`Called waiter: ${type}`)}
                    onRequestBill={() => toast('Bill requested')}
                    menuItems={menuItems}
                    addToCart={handleAddToCart}
                    activeCategory={'all'}
                    setActiveCategory={() => {}} 
                    availability={availability}
                    orderHistory={[]}
                    happyHour={happyHour}
                    announcement={announcement}
                    language={language}
                    setLanguage={setLanguage}
                    theme={theme}
                    setTheme={setTheme}
                    currency={currency}
                    setCurrency={setCurrency}
                    surgePricing={surgePricing}
                 />
             } />
             <Route path="/menu/:tableId" element={
                 <CustomerView 
                    user={null}
                    onPlaceOrder={(items) => items.forEach(handleAddToCart)} 
                    tableId={'4'} // Using same default for now until we hook up useParams inside CustomerView
                    menuItems={menuItems}
                    addToCart={handleAddToCart}
                    activeCategory={'all'}
                    setActiveCategory={() => {}}
                    availability={availability}
                    orderHistory={[]}
                     happyHour={happyHour}
                    announcement={announcement}
                    language={language}
                    setLanguage={setLanguage}
                    theme={theme}
                    setTheme={setTheme}
                    currency={currency}
                    setCurrency={setCurrency}
                    surgePricing={surgePricing}
                     onCallWaiter={(type) => toast(`Called waiter: ${type}`)}
                    onRequestBill={() => toast('Bill requested')}
                    activeOrder={null}
                 />
             } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-6">Welcome, Chef</h1>
                    <div className="grid grid-cols-3 gap-6">
                        <div onClick={() => window.location.href='/admin/kitchen'} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-[#d94e28] cursor-pointer transition-colors group">
                            <h3 className="text-xl font-bold group-hover:text-[#d94e28]">Kitchen Display System</h3>
                            <p className="text-zinc-400 mt-2">View and manage active orders</p>
                        </div>
                        <div onClick={() => window.location.href='/admin/floor'} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-[#d94e28] cursor-pointer transition-colors group">
                            <h3 className="text-xl font-bold group-hover:text-[#d94e28]">Floor Plan</h3>
                            <p className="text-zinc-400 mt-2">Manage tables and reservations</p>
                        </div>
                         <div onClick={() => window.location.href='/admin/analytics'} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-[#d94e28] cursor-pointer transition-colors group">
                            <h3 className="text-xl font-bold group-hover:text-[#d94e28]">Analytics</h3>
                            <p className="text-zinc-400 mt-2">View revenue and performance</p>
                        </div>
                    </div>
                </div>
            } />
            <Route path="kitchen" element={
                <KitchenView 
                    onCreateOrder={() => {}} 
                    orders={useStore().kitchenOrders}
                    onUpdateStatus={(id, status) => store.updateKitchenOrderStatus(id, status)}
                    alerts={[]}
                    onDismissAlert={() => {}}
                    availability={availability}
                    onUpdateStock={handleUpdateStock}
                    busyMode={false} 
                    setBusyMode={() => {}}
                    reservations={reservations}
                    staff={storeStaff}
                    onToggleStaffStatus={(id, active) => store.updateStaffStatus(id, 'busy', active)}
                    happyHour={happyHour}
                    onToggleHappyHour={setHappyHour}
                    onSetAnnouncement={setAnnouncement}
                    onCallTable={() => {}}
                    surgePricing={surgePricing}
                    onToggleSurge={setSurgePricing}
                    deliveryMode={deliveryMode}
                    setDeliveryMode={setDeliveryMode}
                />
            } />
            <Route path="floor" element={<FloorPlan />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="menu" element={<MenuEditor />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="staff" element={<ShiftCalendar />} />
            <Route path="reservations" element={<ReservationCalendar />} />
            <Route path="loyalty" element={<LoyaltyCard />} />
            <Route path="kiosk" element={<KioskMode />} />
            <Route path="dispatch" element={<DriverDispatch />} />
            <Route path="recipe" element={<RecipeCosting />} />
            <Route path="temp" element={<TemperatureLog />} />
            <Route path="haccp" element={<HaccpLog />} />
            <Route path="clock" element={<StaffTimeClock staff={storeStaff} />} />
            <Route path="tips" element={<TipDistribution />} />
            <Route path="feedback" element={<CustomerFeedback />} />
            <Route path="turnover" element={<TurnoverHeatmap />} />
            <Route path="waste" element={<WasteTracking />} />
            <Route path="prep" element={<DailyPrepList />} />
            <Route path="po" element={<PurchaseOrders />} />
            <Route path="locations" element={<LocationManager />} />
            <Route path="dark" element={<DarkKitchen />} />
            <Route path="allergens" element={<AllergenMatrix />} />
            <Route path="nutrition" element={<NutritionalCalc />} />
            <Route path="messaging" element={<StaffMessaging />} />
            <Route path="86" element={<Digital86Board />} />
            <Route path="vip" element={<VipAlerts />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="forecast" element={<AiForecast />} />
            <Route path="roster" element={<SmartRoster />} />
            <Route path="bump" element={<KdsBumpBar />} />
            <Route path="cds" element={<CustomerDisplay />} />
            <Route path="labels" element={<LabelPrinter />} />
            <Route path="delivery-agg" element={<DeliveryAggregator />} />
            <Route path="valet" element={<ValetTracker />} />
            <Route path="lost-found" element={<LostFoundLog />} />
            <Route path="music" element={<MusicPlayer />} />
            <Route path="lighting" element={<LightingControl />} />
            <Route path="sommelier" element={<DigitalSommelier />} />
            <Route path="charcuterie" element={<CharcuterieBuilder />} />
            <Route path="catering" element={<CateringManagement />} />
            <Route path="franchise" element={<FranchiseDashboard />} />
            <Route path="mystery" element={<MysteryShopper />} />
            <Route path="maintenance" element={<MaintenanceLogView />} />
            <Route path="refunds" element={<RefundManager />} />
            <Route path="vendors" element={<VendorScorecardView />} />
            <Route path="sentiment" element={<SentimentAnalysisView />} />
            <Route path="gamification" element={<StaffGamification />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={handleRemoveFromCart}
        onSubmit={placeOrder}
        total={cart.reduce((a,b) => a + (b.price * b.quantity), 0)}
        orderHistory={[]}
        onShowFeedback={() => {}} 
        onReorder={(items) => items.forEach(handleAddToCart)}
        currency={currency}
      />
    </div>
  );
}

export default App;
