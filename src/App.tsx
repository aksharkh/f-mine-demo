import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Settings, LogOut
} from 'lucide-react';
import { type Order, type MenuItem, type Staff, type Reservation, type CartItem } from './types';
import { MENU_ITEMS } from './lib/constants';
import CartDrawer from './components/features/CartDrawer';
import CustomerView from './pages/CustomerView';
import KitchenView from './pages/KitchenView';
import { cn } from './lib/utils';

// Mock Data
const MOCK_STAFF: Staff[] = [
  { id: '1', name: 'Chef Gordon', role: 'Head Chef', status: 'busy', active: true, start: '10:00', ordersCompleted: 12 },
  { id: '2', name: 'Sous Chef Marco', role: 'Sous Chef', status: 'online', active: true, start: '11:00', ordersCompleted: 8 },
  { id: '3', name: 'Waiter John', role: 'Server', status: 'online', active: true, start: '10:30', ordersCompleted: 25 },
];

const MOCK_RESERVATIONS: Reservation[] = [
  { id: '1', userId: 'user-1', time: '19:00', name: 'Smith Party', partySize: 4, notes: 'Birthday', tableId: '4' },
  { id: '2', userId: 'user-2', time: '19:30', name: 'Jones Date', partySize: 2, notes: 'Anniversary', tableId: '8' },
];

function App() {
  // Global State
  const [view, setView] = useState<'customer' | 'kitchen'>('customer');
  const [tableId, setTableId] = useState('4');
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Remove unused setMenuItems
  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [availability, setAvailability] = useState<Record<string, { stock: number }>>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  // Remove unused setReservations
  const [reservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  
  // App Settings
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Kitchen Controls
  const [busyMode, setBusyMode] = useState(false);
  const [happyHour, setHappyHour] = useState(false);
  const [surgePricing, setSurgePricing] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  // Initialize Stock
  useEffect(() => {
    const initialStock: Record<string, { stock: number }> = {};
    MENU_ITEMS.forEach(item => { initialStock[item.id] = { stock: 20 }; });
    setAvailability(initialStock);
    
    // Check URL params for view
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'kitchen') setView('kitchen');
    if (params.get('table')) setTableId(params.get('table')!);
  }, []);

  // Handlers
  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const placeOrder = (total: number, isPriority: boolean = false, scheduledTime: string = "") => {
    if (cart.length === 0) return;
    
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
      delivery: false // Default to false
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setIsCartOpen(false);
    
    // Decrease stock
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

  const updateOrderStatus = (orderId: string, status: any, prepTime?: number | null, voidReason?: string | null) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const update: any = { status };
        if (prepTime) {
           update.estimatedCompletion = new Date(new Date().getTime() + prepTime * 60000);
        }
        if (voidReason) {
           update.voidReason = voidReason;
        }
        return { ...o, ...update };
      }
      return o;
    }));
  };

  const callWaiter = (type: string) => {
    const newAlert = { id: Date.now().toString(), tableId, type, time: new Date() };
    setAlerts(prev => [...prev, newAlert]);
    alert(`Waiter called for ${type}`);
  };

  const activeOrder = orders.find(o => o.tableId === tableId && o.status !== 'served' && o.status !== 'cancelled') || null;
  const orderHistory = orders.filter(o => o.tableId === tableId && (o.status === 'served' || o.status === 'cancelled'));
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className={cn("min-h-screen transition-colors duration-300", theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#f4f4f5] text-black')}>
      
      {/* Dev Toggle */}
      <div className="fixed bottom-4 right-4 z-[60] flex gap-2">
         {view === 'customer' && (
           <button 
             onClick={() => setIsCartOpen(true)}
             className="bg-[#d94e28] text-white p-4 rounded-full shadow-2xl relative animate-in zoom-in"
           >
             <ShoppingBag size={24} />
             {cart.length > 0 && (
               <span className="absolute -top-2 -right-2 bg-white text-[#d94e28] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-[#d94e28]">
                 {cart.reduce((a,b) => a + b.quantity, 0)}
               </span>
             )}
           </button>
         )}
         <button 
           onClick={() => setView(v => v === 'customer' ? 'kitchen' : 'customer')} 
           className="bg-black/50 text-white p-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-all"
           title="Switch View"
         >
           {view === 'customer' ? <Settings size={20} /> : <LogOut size={20} />}
         </button>
      </div>

      {view === 'customer' ? (
        <CustomerView 
          tableId={tableId}
          user={null} // Pass null or unused
          activeOrder={activeOrder}
          onPlaceOrder={(items) => items.forEach(addToCart)} // Simplified
          onCallWaiter={callWaiter}
          onRequestBill={() => callWaiter('bill')}
          menuItems={menuItems}
          addToCart={addToCart}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          availability={availability}
          orderHistory={orderHistory}
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
      ) : (
        <KitchenView 
          orders={orders}
          onUpdateStatus={updateOrderStatus}
          alerts={alerts}
          onDismissAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))}
          availability={availability}
          onUpdateStock={(id, val) => setAvailability(prev => ({ ...prev, [id]: { stock: val } }))}
          onCreateOrder={() => {}} 
          busyMode={busyMode}
          setBusyMode={setBusyMode}
          reservations={reservations}
          staff={staff}
          onToggleStaffStatus={(id, active) => setStaff(prev => prev.map(s => s.id === id ? { ...s, active } : s))}
          happyHour={happyHour}
          onToggleHappyHour={setHappyHour}
          onSetAnnouncement={setAnnouncement}
          onCallTable={(tid, msg) => alert(`Calling Table ${tid}: ${msg}`)}
          surgePricing={surgePricing}
          onToggleSurge={setSurgePricing}
          deliveryMode={deliveryMode}
          setDeliveryMode={setDeliveryMode}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onSubmit={placeOrder}
        total={cartTotal}
        orderHistory={orderHistory}
        onShowFeedback={() => {}} 
        onReorder={(items) => items.forEach(addToCart)}
        currency={currency}
      />
    </div>
  );
}

export default App;
