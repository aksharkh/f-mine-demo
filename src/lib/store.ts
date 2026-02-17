import { useState, useEffect } from 'react';
import type { 
  MaintenanceLog, 
  RefundRequest, 
  ValetTicket, 
  LostItem, 
  VendorScorecard,
  GamificationStats,
  SentimentAnalysis,
  AggregatedOrder,
  Order,
  Driver,
  TempLogEntry,
  HaccpLogEntry,
  RecipeCost,
  TimeClockEntry,
  TipRule,
  Feedback,
  HeatmapData,
  WasteLog,
  Table,
  MenuItem,
  InventoryItem,
  Reservation,
  RosterShift,
  Staff,
  CartItem
} from '../types';

import { MENU_ITEMS } from './constants';

// --- Initial Mock Data ---

const INITIAL_MAINTENANCE: MaintenanceLog[] = [
    { id: '1', equipment: 'Walk-in Freezer', issue: 'Not holding temp', priority: 'high', status: 'in-progress', reportedDate: '2024-03-20', cost: 0 },
    { id: '2', equipment: 'Espresso Machine', issue: 'Group head leak', priority: 'medium', status: 'fixed', reportedDate: '2024-03-18', cost: 150 },
];

const INITIAL_REFUNDS: RefundRequest[] = [
    { id: '1', orderId: '#1023', amount: 45.50, reason: 'Food quality complain', status: 'pending', requestedBy: 'Sarah (Server)', date: '2024-03-21' },
    { id: '2', orderId: '#1011', amount: 12.00, reason: 'Wrong item charged', status: 'approved', requestedBy: 'Mike (Manager)', date: '2024-03-20' },
];

const INITIAL_VALET: ValetTicket[] = [
    { id: '1', ticketNumber: 'V-101', carModel: 'Tesla Model 3', plate: 'ABC-123', ownerName: 'John Doe', status: 'parked', parkedTime: '19:30' },
    { id: '2', ticketNumber: 'V-102', carModel: 'BMW X5', plate: 'XYZ-987', ownerName: 'Jane Smith', status: 'requested', parkedTime: '20:15', spot: 'A-12' },
];

const INITIAL_LOST_ITEMS: LostItem[] = [
    { id: '1', item: 'iPhone 14 Pro', description: 'Black case, cracked screen', foundLocation: 'Table 4', foundBy: 'Mike', date: '2024-03-20', status: 'unclaimed' },
    { id: '2', item: 'Umbrella', description: 'Blue with wooden handle', foundLocation: 'Entrance', foundBy: 'Sarah', date: '2024-03-19', status: 'claimed' },
];

const INITIAL_VENDORS: VendorScorecard[] = [
     { id: '1', vendorName: 'Fresh Farms Produce', category: 'Vegetables', qualityScore: 9.2, deliveryScore: 8.5, priceScore: 7.0, lastReviewDate: '2024-03-01' },
     { id: '2', vendorName: 'Prime Meats Co.', category: 'Meat', qualityScore: 9.8, deliveryScore: 9.5, priceScore: 6.5, lastReviewDate: '2024-02-28' },
];

const INITIAL_STATS: GamificationStats = {
    staffId: '1', level: 12, xp: 2450, streak: 5, leaderboardRank: 3, badges: ['Speed Demon', 'Customer Favorite', 'Early Bird']
};

const INITIAL_SENTIMENT: SentimentAnalysis[] = [
    { id: '1', source: 'Yelp', text: 'Best pasta I have ever had! The service was impeccable.', sentiment: 'positive', score: 0.95, date: '2h ago' },
    { id: '2', source: 'Google', text: 'Food was okay but the wait was too long.', sentiment: 'neutral', score: 0.1, date: '5h ago' },
    { id: '3', source: 'Facebook', text: 'Terrible experience. Cold soup.', sentiment: 'negative', score: -0.8, date: '1d ago' },
];

const INITIAL_ORDERS: AggregatedOrder[] = [
    { id: '1', platform: 'UberEats', platformOrderId: '#UE-9283', customerName: 'Alice Johnson', items: ['Margherita Pizza', 'Coke'], total: 24.50, status: 'new', time: 'Just now' },
    { id: '2', platform: 'DoorDash', platformOrderId: '#DD-1122', customerName: 'Bob Smith', items: ['Burger', 'Fries'], total: 18.00, status: 'cooking', driverName: 'Mike (Toyota Camry)', time: '10m ago' },
];

const INITIAL_KITCHEN_ORDERS: Order[] = [
    { id: '101', userId: 'user1', tableId: 'T1', items: [], status: 'pending', createdAt: new Date(), total: 45.00 },
];

const INITIAL_DRIVERS: Driver[] = [
    { id: '1', name: 'John Doe', variable: 'available', activeOrders: [] },
    { id: '2', name: 'Jane Smith', variable: 'busy', activeOrders: ['#1024'] },
];

const INITIAL_TEMP_LOGS: TempLogEntry[] = [
    { id: '1', unitName: 'Walk-in Fridge 1', temperature: 3.2, timestamp: '08:00 AM', checkedBy: 'Chef Mike', status: 'ok' },
];

const INITIAL_HACCP_LOGS: HaccpLogEntry[] = [
    { id: '1', itemId: '101', itemName: 'Beef Stock', action: 'cooling', startTemp: 95, endTemp: 21, b: '14:00', endTime: '16:00', operator: 'Sarah J', pass: true },
];

const INITIAL_RECIPES: RecipeCost[] = [
    { 
        id: '1', menuItemId: '1', totalCost: 4.50, sellingPrice: 18.00, marginPercent: 75,
        ingredients: [
          { name: 'Sourdough', cost: 0.80, quantity: '2 slices' },
          { name: 'Mushrooms', cost: 2.20, quantity: '150g' },
          { name: 'Truffle Oil', cost: 1.00, quantity: '10ml' },
          { name: 'Egg', cost: 0.50, quantity: '1' }
        ]
    }
];

const INITIAL_CLOCKS: TimeClockEntry[] = [
    { id: '1', staffId: '1', staffName: 'Chef Gordon', clockIn: '10:00 AM', clockOut: 'In Progress' },
];

const INITIAL_TIP_RULES: TipRule[] = [
    { id: '1', role: 'Wait Staff', percentage: 60 },
    { id: '2', role: 'Kitchen (BOH)', percentage: 30 },
    { id: '3', role: 'Bar', percentage: 10 },
];

const INITIAL_FEEDBACK: Feedback[] = [
    { id: '1', rating: 5, comment: "Amazing truffle toast! Best I've ever had.", date: '2024-03-15', tags: ['Food'] },
    { id: '2', rating: 4, comment: "Service was great but music was a bit loud.", date: '2024-03-14', tags: ['Service', 'Ambiance'] },
];

const INITIAL_HEATMAP: HeatmapData[] = [
    { tableId: '1', turnoverCount: 12, avgDuration: 45 },
    { tableId: '2', turnoverCount: 8, avgDuration: 60 },
    { tableId: '4', turnoverCount: 15, avgDuration: 40 },
];

const INITIAL_WASTE: WasteLog[] = [
    { id: '1', itemId: '101', itemName: 'Avocado', quantity: 2, reason: 'spoilage', cost: 3.50, date: '2024-03-15', reportedBy: 'Chef Gordon' },
];

const INITIAL_TABLES: Table[] = [
    { id: 't1', name: 'T1', x: 50, y: 50, seats: 4, shape: 'round', status: 'free' },
    { id: 't2', name: 'T2', x: 200, y: 50, seats: 4, shape: 'round', status: 'occupied' },
    { id: 't3', name: 'T3', x: 50, y: 200, seats: 6, shape: 'rect', status: 'reserved' },
    { id: 't4', name: 'T4', x: 250, y: 200, seats: 2, shape: 'rect', status: 'dirty' },
    { id: 't5', name: 'VIP', x: 400, y: 100, seats: 8, shape: 'rect', status: 'free' },
];

const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
    { id: 'ing-1', name: 'Wagyu Beef', stock: 15, lowStockThreshold: 10, unit: 'kg' },
    { id: 'ing-2', name: 'Truffle Oil', stock: 2, lowStockThreshold: 5, unit: 'L' },
    { id: 'ing-3', name: 'Burger Buns', stock: 50, lowStockThreshold: 20, unit: 'pcs' },
];

const INITIAL_SHIFTS: RosterShift[] = [
    { id: '1', staffId: '1', staffName: 'Chef Gordon', date: '2024-02-20', start: '10:00', end: '18:00', role: 'Head Chef', isAutoGenerated: false },
    { id: '2', staffId: '2', staffName: 'Waitress Sarah', date: '2024-02-20', start: '14:00', end: '22:00', role: 'Server', isAutoGenerated: false },
];

const INITIAL_RESERVATIONS: Reservation[] = [
    { id: '1', userId: 'u1', name: 'Smith', time: '18:00', partySize: 4, tableId: 't1', createdAt: new Date() as any },
    { id: '2', userId: 'u2', name: 'Johnson', time: '19:30', partySize: 2, tableId: 't2', createdAt: new Date() as any },
    { id: '3', userId: 'u3', name: 'Williams', time: '20:00', partySize: 6, tableId: 'vip', createdAt: new Date() as any },
];

const INITIAL_LOYALTY_POINTS = 2450;



// --- Store Implementation ---

class KitchenStore {
  // State Containers
  maintenanceLogs: MaintenanceLog[] = INITIAL_MAINTENANCE;
  refundRequests: RefundRequest[] = INITIAL_REFUNDS;
  valetTickets: ValetTicket[] = INITIAL_VALET;
  lostItems: LostItem[] = INITIAL_LOST_ITEMS;
  vendorScorecards: VendorScorecard[] = INITIAL_VENDORS;
  gamificationStats: GamificationStats = INITIAL_STATS;
  sentimentAnalysis: SentimentAnalysis[] = INITIAL_SENTIMENT;
  deliveryOrders: AggregatedOrder[] = INITIAL_ORDERS;
  kitchenOrders: Order[] = INITIAL_KITCHEN_ORDERS;
  drivers: Driver[] = INITIAL_DRIVERS;
  tempLogs: TempLogEntry[] = INITIAL_TEMP_LOGS;
  haccpLogs: HaccpLogEntry[] = INITIAL_HACCP_LOGS;
  recipeCosts: RecipeCost[] = INITIAL_RECIPES;
  timeClocks: TimeClockEntry[] = INITIAL_CLOCKS;
  tipRules: TipRule[] = INITIAL_TIP_RULES;
  feedbacks: Feedback[] = INITIAL_FEEDBACK;
  heatmapData: HeatmapData[] = INITIAL_HEATMAP;
  wasteLogs: WasteLog[] = INITIAL_WASTE;
  tables: Table[] = INITIAL_TABLES;
  menuItems: MenuItem[] = MENU_ITEMS;
  inventory: InventoryItem[] = INITIAL_INVENTORY_ITEMS;
  shifts: RosterShift[] = INITIAL_SHIFTS;
  reservations: Reservation[] = INITIAL_RESERVATIONS;
  loyaltyPoints: number = INITIAL_LOYALTY_POINTS;
  staff: Staff[] = [
      { id: '1', name: 'Chef Gordon', role: 'Head Chef', status: 'busy', active: true, start: '10:00', ordersCompleted: 12 },
      { id: '2', name: 'Sous Chef Marco', role: 'Sous Chef', status: 'online', active: true, start: '11:00', ordersCompleted: 8 },
      { id: '3', name: 'Waiter John', role: 'Server', status: 'online', active: true, start: '10:30', ordersCompleted: 25 },
  ];
  cart: CartItem[] = [];

  // Listeners
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  // --- Actions ---

  // Staff
  updateStaffStatus(id: string, status: Staff['status'], active: boolean) {
      this.staff = this.staff.map(s => s.id === id ? { ...s, status, active } : s);
      this.notify();
  }

  // Cart
  addToCart(item: CartItem) {
      this.cart = [...this.cart, item];
      this.notify();
  }
  removeFromCart(index: number) {
      this.cart = this.cart.filter((_, i) => i !== index);
      this.notify();
  }
  clearCart() {
      this.cart = [];
      this.notify();
  }

  // Maintenance
  addMaintenanceLog(log: MaintenanceLog) {
    this.maintenanceLogs = [log, ...this.maintenanceLogs];
    this.notify();
  }
  updateMaintenanceStatus(id: string, status: MaintenanceLog['status']) {
    this.maintenanceLogs = this.maintenanceLogs.map(l => l.id === id ? { ...l, status } : l);
    this.notify();
  }

  // Refunds
  updateRefundStatus(id: string, status: RefundRequest['status']) {
    this.refundRequests = this.refundRequests.map(r => r.id === id ? { ...r, status } : r);
    this.notify();
  }

  // Valet
  addValetTicket(ticket: ValetTicket) {
      this.valetTickets = [ticket, ...this.valetTickets];
      this.notify();
  }
  updateValetStatus(id: string, status: ValetTicket['status']) {
      this.valetTickets = this.valetTickets.map(t => t.id === id ? { ...t, status } : t);
      this.notify();
  }

  // Lost & Found
  addLostItem(item: LostItem) {
      this.lostItems = [item, ...this.lostItems];
      this.notify();
  }
  claimLostItem(id: string) {
      this.lostItems = this.lostItems.map(i => i.id === id ? { ...i, status: 'claimed' } : i);
      this.notify();
  }

  // Vendors
  updateVendorScore(id: string, updates: Partial<VendorScorecard>) {
      this.vendorScorecards = this.vendorScorecards.map(v => v.id === id ? { ...v, ...updates } : v);
      this.notify();
  }

  // Delivery
  addDeliveryOrder(order: AggregatedOrder) {
      this.deliveryOrders = [order, ...this.deliveryOrders];
      this.notify();
  }
  updateDeliveryStatus(id: string, status: AggregatedOrder['status']) {
      this.deliveryOrders = this.deliveryOrders.map(o => o.id === id ? { ...o, status } : o);
      this.notify();
  }

  // Gamification
  addXP(amount: number) {
      this.gamificationStats = { ...this.gamificationStats, xp: this.gamificationStats.xp + amount };
      this.notify();
  }

  // Sentiment
  addSentimentReview(review: SentimentAnalysis) {
      this.sentimentAnalysis = [review, ...this.sentimentAnalysis];
      this.notify();
  }

  // --- New Feature Actions ---

  // Kitchen Orders
  addKitchenOrder(order: Order) {
      this.kitchenOrders = [order, ...this.kitchenOrders];
      this.notify();
  }
  updateKitchenOrderStatus(id: string, status: Order['status']) {
      this.kitchenOrders = this.kitchenOrders.map(o => o.id === id ? { ...o, status } : o);
      this.notify();
  }

  // Drivers
  updateDriverStatus(id: string, status: Driver['variable']) {
      this.drivers = this.drivers.map(d => d.id === id ? { ...d, variable: status } : d);
      this.notify();
  }
  assignDriverToOrder(driverId: string, orderId: string) {
      this.drivers = this.drivers.map(d => d.id === driverId ? { ...d, activeOrders: [...d.activeOrders, orderId], variable: 'busy' } : d);
      this.notify();
  }

  // Logs
  addTempLog(log: TempLogEntry) {
      this.tempLogs = [log, ...this.tempLogs];
      this.notify();
  }
  addHaccpLog(log: HaccpLogEntry) {
      this.haccpLogs = [log, ...this.haccpLogs];
      this.notify();
  }

  // Recipe Costing
  updateRecipeCost(id: string, updates: Partial<RecipeCost>) {
      this.recipeCosts = this.recipeCosts.map(r => r.id === id ? { ...r, ...updates } : r);
      this.notify();
  }

  // Time Clock
  clockIn(entry: TimeClockEntry) {
      this.timeClocks = [entry, ...this.timeClocks];
      this.notify();
  }
  clockOut(id: string, time: string) {
      this.timeClocks = this.timeClocks.map(c => c.id === id ? { ...c, clockOut: time, totalHours: 8 } : c); // Mock hours
      this.notify();
  }

  // Tips
  updateTipRule(id: string, percentage: number) {
      this.tipRules = this.tipRules.map(r => r.id === id ? { ...r, percentage } : r);
      this.notify();
  }

  // Feedback
  addFeedback(feedback: Feedback) {
      this.feedbacks = [feedback, ...this.feedbacks];
      this.notify();
  }

  // Waste
  addWasteLog(log: WasteLog) {
      this.wasteLogs = [log, ...this.wasteLogs];
      this.notify();
  }

  // Tables
  updateTable(id: string, updates: Partial<Table>) {
      this.tables = this.tables.map(t => t.id === id ? { ...t, ...updates } : t);
      this.notify();
  }

  // Menu
  addMenuItem(item: MenuItem) {
      this.menuItems = [...this.menuItems, item];
      this.notify();
  }
  updateMenuItem(id: string, updates: Partial<MenuItem>) {
      this.menuItems = this.menuItems.map(i => i.id === id ? { ...i, ...updates } : i);
      this.notify();
  }
  deleteMenuItem(id: string) {
      this.menuItems = this.menuItems.filter(i => i.id !== id);
      this.notify();
  }

  // Inventory
  addInventoryItem(item: InventoryItem) {
      this.inventory = [...this.inventory, item];
      this.notify();
  }
  updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
      this.inventory = this.inventory.map(i => i.id === id ? { ...i, ...updates } : i);
      this.notify();
  }
  deleteInventoryItem(id: string) {
      this.inventory = this.inventory.filter(i => i.id !== id);
      this.notify();
  }

  // Shifts
  addShift(shift: RosterShift) {
      this.shifts = [...this.shifts, shift];
      this.notify();
  }
  deleteShift(id: string) {
      this.shifts = this.shifts.filter(s => s.id !== id);
      this.notify();
  }

  // Reservations
  addReservation(res: Reservation) {
      this.reservations = [...this.reservations, res];
      this.notify();
  }
  updateReservation(id: string, updates: Partial<Reservation>) {
      this.reservations = this.reservations.map(r => r.id === id ? { ...r, ...updates } : r);
      this.notify();
  }

  // Loyalty
  addLoyaltyPoints(points: number) {
      this.loyaltyPoints += points;
      this.notify();
  }
  redeemLoyaltyPoints(points: number) {
      if (this.loyaltyPoints >= points) {
          this.loyaltyPoints -= points;
          this.notify();
          return true;
      }
      return false;
  }
}

export const store = new KitchenStore();

// --- React Hook ---

export function useStore() {
  const [, setState] = useState(0); // Tick to trigger re-render
  
  useEffect(() => {
    return store.subscribe(() => setState(prev => prev + 1));
  }, []);

  return store;
}
