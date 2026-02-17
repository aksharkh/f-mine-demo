import { Timestamp } from "firebase/firestore";

export type CategoryId = 'all' | 'signature' | 'coffee' | 'dessert' | 'favorites';
export type DietaryId = 'veg' | 'gf' | 'vegan';
export type Station = 'kitchen' | 'bar';
export type Course = 'starter' | 'main' | 'dessert';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type PrepStatus = 'pending' | 'in-progress' | 'completed';

export interface PrepTask {
  id: string;
  item: string;
  quantity: string;
  station: string;
  status: PrepStatus;
  assignedTo?: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: { name: string; quantity: number; unitCost: number }[];
  total: number;
  status: 'draft' | 'ordered' | 'received';
  date: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  manager: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  station: Station;
  description: string;
  ingredients: string;
  calories: string;
  macros?: { protein: string; carbs: string; fat: string };
  moods?: string[];
  image: string;
  tags: string[];
  dietary: DietaryId[];
  allergens?: string[];
  options: { name: string; choices: string[] }[];
  pairings?: string[];
  instructions?: string[];
  translations?: Record<string, { name: string; description: string }>;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
  course?: Course;
  selectedOptions?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  tableId: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: Timestamp | Date;
  total: number;
  isPriority?: boolean;
  scheduledTime?: string;
  estimatedCompletion?: Timestamp | Date;
  voidReason?: string;
  delivery?: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  active: boolean;
  ordersCompleted: number;
  start: string;
  end?: string;
  status: 'online' | 'busy' | 'offline';
}

export interface Reservation {
  id: string;
  userId: string;
  name: string;
  time: string;
  partySize: number;
  notes?: string;
  tableId?: string;
  createdAt?: Timestamp;
}


export interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  seats: number;
  shape: 'round' | 'rect';
  status: 'free' | 'occupied' | 'reserved' | 'dirty';
}

export interface StockStatus {
  stock: number;
  lowStockThreshold?: number;
  unit?: string;
}

export interface InventoryItem extends StockStatus {
    id: string;
    name: string;
}

export interface Driver {
  id: string;
  name: string;
  variable: 'available' | 'busy' | 'offline';
  activeOrders: string[];
}

export interface TempLogEntry {
  id: string;
  unitName: string; // e.g., "Walk-in Fridge"
  temperature: number;
  timestamp: string;
  checkedBy: string;
  status: 'ok' | 'warning' | 'critical';
}

export interface HaccpLogEntry {
  id: string;
  itemId: string;
  itemName: string;
  action: 'cooling' | 'reheating' | 'holding';
  startTemp: number;
  endTemp: number;
  b: string; // startTime
  endTime: string;
  operator: string;
  pass: boolean;
}

export interface RecipeCost {
  id: string;
  menuItemId: string;
  totalCost: number;
  sellingPrice: number;
  marginPercent: number;
  ingredients: { name: string; cost: number; quantity: string }[];
}

export interface TimeClockEntry {
  id: string;
  staffId: string;
  staffName: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
}

export interface TipRule {
  id: string;
  role: string;
  percentage: number; // e.g., 60% to Waiters, 40% to Kitchen
}

export interface Feedback {
  id: string;
  orderId?: string;
  rating: number; // 1-5
  comment?: string;
  date: string;
  tags?: string[]; // e.g., "Food", "Service"
}

export interface HeatmapData {
  tableId: string;
  turnoverCount: number;
  avgDuration: number; // minutes
}

export interface WasteLog {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: 'spoilage' | 'burnt' | 'dropped' | 'customer_return';
  cost: number;
  date: string;
  reportedBy: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  category: 'general' | 'urgent' | 'fun';
}

export interface VipGuest {
  id: string;
  name: string;
  preferences: string; // e.g., "Table 4, Sparkling Water"
  visits: number;
  avgSpend: number;
  lastVisit: string;
}

export interface EventBooking {
  id: string;
  name: string;
  date: string;
  guests: number;
  type: 'birthday' | 'corporate' | 'wedding';
  depositPaid: boolean;
  status: 'inquiry' | 'confirmed' | 'completed';
}

export interface ForecastData {
  date: string;
  predictedSales: number;
  weather: 'sunny' | 'rainy' | 'cloudy';
  events?: string;
}

export interface RosterShift {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  start: string;
  end: string;
  role: string;
  isAutoGenerated: boolean;
}

export interface LabelTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  fields: string[]; // e.g. ["Item Name", "Modifiers", "Date"]
}

export interface AggregatedOrder {
  id: string;
  platform: 'UberEats' | 'DoorDash' | 'GrubHub' | 'Direct';
  platformOrderId: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'new' | 'cooking' | 'ready' | 'picked_up';
  driverName?: string;
  time: string;
}

export interface ValetTicket {
  id: string;
  ticketNumber: string;
  carModel: string;
  plate: string;
  ownerName: string;
  status: 'parked' | 'requested' | 'retrieved';
  parkedTime: string;
  spot?: string;
}

export interface LostItem {
  id: string;
  item: string;
  description: string;
  foundLocation: string;
  foundBy: string;
  date: string;
  status: 'unclaimed' | 'claimed';
  image?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  albumArt: string;
}

export interface LightZone {
  id: string;
  name: string;
  brightness: number; // 0-100
  colorTemp: number; // 2700-6500K
  isOn: boolean;
}

export interface Wine {
  id: string;
  name: string;
  type: 'Red' | 'White' | 'Rose' | 'Sparkling';
  region: string;
  price: number;
  tags: string[]; // "Bold", "Fruity"
  pairings: string[];
  image: string;
}

export interface CharcuterieItem {
  id: string;
  name: string;
  type: 'Meat' | 'Cheese' | 'Fruit' | 'Cracker' | 'Accompaniment' | 'Nut';
  price: number;
  image: string;
}

export interface CateringEvent {
  id: string;
  clientName: string;
  date: string;
  guests: number;
  location: string;
  status: 'Lead' | 'Booked' | 'Delivered' | 'Proposal Sent' | 'Cancelled' | 'Completed';
  totalValue: number;
}

export interface FranchiseStore {
  id: string;
  name: string;
  location: string;
  monthlyRevenue: number;
  royaltyDue: number;
  performanceScore: number; // 0-100
}

export interface MysteryReport {
  id: string;
  shopperId: string;
  date: string;
  scores: {
    service: number;
    food: number;
    cleanliness: number;
    ambiance: number;
  };
  comments: string;
  totalScore: number;
}

export interface MaintenanceLog {
  id: string;
  equipment: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'reported' | 'in-progress' | 'fixed';
  reportedDate: string;
  cost?: number;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  date: string;
}

export interface VendorScorecard {
  id: string;
  vendorName: string;
  category: string;
  qualityScore: number; // 1-10
  deliveryScore: number; // 1-10
  priceScore: number; // 1-10
  lastReviewDate: string;
}

export interface SentimentAnalysis {
  id: string;
  source: 'Yelp' | 'Google' | 'Facebook';
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  date: string;
}

export interface GamificationStats {
  staffId: string;
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  leaderboardRank: number;
}
