import { Timestamp } from "firebase/firestore";

export type CategoryId = 'all' | 'signature' | 'coffee' | 'dessert' | 'favorites';
export type DietaryId = 'veg' | 'gf' | 'vegan';
export type Station = 'kitchen' | 'bar';
export type Course = 'starter' | 'main' | 'dessert';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

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

export interface StockStatus {
  stock: number;
}
