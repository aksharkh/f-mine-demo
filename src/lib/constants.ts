
import { Utensils, Flame, Coffee, ShoppingBag, Leaf, Ban, Heart } from 'lucide-react';
import { type MenuItem } from '../types';

export const DICTIONARY: Record<string, any> = {
  en: {
    search: "Search...",
    waiter: "Waiter",
    bill: "Bill",
    service: "Service",
    favorites: "Favorites",
    orderProgress: "Order In Progress",
    sent: "Sent",
    cooking: "Cooking",
    ready: "Ready",
    addOrder: "Add to Order",
    soldOut: "Sold Out",
    special: "Chef's Special",
    orderNow: "Order Now",
    rewards: "Rewards",
    pts: "pts"
  },
  es: {
    search: "Buscar...",
    waiter: "Mesero",
    bill: "Cuenta",
    service: "Servicio",
    favorites: "Favoritos",
    orderProgress: "Orden en Curso",
    sent: "Enviado",
    cooking: "Cocinando",
    ready: "Listo",
    addOrder: "Agregar",
    soldOut: "Agotado",
    special: "Especial del Chef",
    orderNow: "Ordenar Ahora",
    rewards: "Puntos",
    pts: "pts"
  },
  fr: {
    search: "Rechercher...",
    waiter: "Serveur",
    bill: "Addition",
    service: "Service",
    favorites: "Favoris",
    orderProgress: "Commande en cours",
    sent: "Envoyé",
    cooking: "Cuisson",
    ready: "Prêt",
    addOrder: "Ajouter",
    soldOut: "Épuisé",
    special: "Spécial du Chef",
    orderNow: "Commander",
    rewards: "Fidélité",
    pts: "pts"
  }
};

export const CURRENCIES: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 }
};

export const CATEGORIES = [
  { id: 'all', name: 'All Menu', icon: Utensils },
  { id: 'signature', name: 'Chef\'s Choice', icon: Flame },
  { id: 'coffee', name: 'Artisan Coffee', icon: Coffee },
  { id: 'dessert', name: 'Sweet Tooth', icon: ShoppingBag },
];

export const DIETARY_FILTERS = [
  { id: 'veg', label: 'Vegetarian', icon: Leaf },
  { id: 'gf', label: 'Gluten Free', icon: Ban },
  { id: 'vegan', label: 'Vegan', icon: Heart },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Truffle Mushroom Toast",
    price: 18,
    category: "signature",
    station: "kitchen",
    description: "Slow-fermented sourdough topped with sautéed wild mushrooms, truffle oil, and a poached egg.",
    ingredients: "Sourdough, Wild Mushrooms, Truffle Oil, Free-range Egg, Chives",
    calories: "450 kcal",
    macros: { protein: "18g", carbs: "42g", fat: "22g" },
    moods: ["comfort", "indulgent"],
    image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800",
    tags: ["Vegetarian", "Best Seller"],
    dietary: ['veg'],
    allergens: ['gluten', 'egg'],
    options: [
      { name: "Egg Preference", choices: ["Poached", "Fried", "Scrambled", "None"] },
      { name: "Bread Type", choices: ["Sourdough", "Gluten Free (+$2)", "Rye"] }
    ],
    pairings: ["3", "4"],
    instructions: ["Toast sourdough until golden.", "Sauté mushrooms with garlic and thyme.", "Poach egg at 63°C for 45 mins.", "Assemble and drizzle truffle oil."],
    translations: {
      es: { name: "Tostada de Champiñones", description: "Masa madre con champiñones salteados y aceite de trufa." },
      fr: { name: "Toast aux Champignons", description: "Pain au levain aux champignons sauvages et huile de truffe." }
    }
  },
  {
    id: "2",
    name: "Avocado & Dukkah",
    price: 16,
    category: "signature",
    station: "kitchen",
    description: "Smashed avocado on rye, sprinkled with hazelnut dukkah, feta, and chili flakes.",
    ingredients: "Rye Bread, Hass Avocado, Hazelnuts, Sesame Seeds, Feta",
    calories: "380 kcal",
    macros: { protein: "12g", carbs: "35g", fat: "28g" },
    moods: ["healthy", "energizing"],
    image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&q=80&w=800",
    tags: ["Healthy"],
    dietary: ['veg'],
    allergens: ['gluten', 'nuts', 'sesame', 'dairy'],
    options: [
      { name: "Add-ons", choices: ["None", "Poached Egg (+$3)", "Bacon (+$4)", "Smoked Salmon (+$5)"] }
    ],
    pairings: ["3"],
    instructions: ["Mash avocado with lemon juice.", "Spread on toasted rye.", "Sprinkle generously with dukkah and feta."],
    translations: {
      es: { name: "Aguacate y Dukkah", description: "Aguacate machacado sobre centeno con dukkah de avellana." },
      fr: { name: "Avocat & Dukkah", description: "Avocat écrasé sur seigle avec dukkah aux noisettes." }
    }
  },
  {
    id: "3",
    name: "Nitro Cold Brew",
    price: 8,
    category: "coffee",
    station: "bar",
    description: "Velvety smooth cold brew coffee infused with nitrogen for a creamy texture.",
    ingredients: "100% Arabica Coffee, Nitrogen",
    calories: "5 kcal",
    macros: { protein: "0g", carbs: "1g", fat: "0g" },
    moods: ["energizing", "quick"],
    image: "https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&q=80&w=800",
    tags: ["Cold", "Strong"],
    dietary: ['veg', 'vegan', 'gf'],
    allergens: [],
    options: [
      { name: "Sweetness", choices: ["None", "Little Sugar", "Sweet"] },
      { name: "Milk", choices: ["Black", "Oat (+$1)", "Almond (+$1)", "Dairy"] }
    ],
    pairings: ["5"],
    instructions: ["Pour cold brew concentrate.", "Charge with Nitrogen.", "Serve immediately for cascading effect."],
    translations: {
      es: { name: "Nitro Café Frío", description: "Café frío suave con nitrógeno." },
      fr: { name: "Nitro Café Glacé", description: "Café infusé à froid velouté à l'azote." }
    }
  },
  {
    id: "4",
    name: "Matcha Latte",
    price: 7,
    category: "coffee",
    station: "bar",
    description: "Premium ceremonial grade matcha whisked with oat milk and honey.",
    ingredients: "Matcha Powder, Oat Milk, Honey",
    calories: "120 kcal",
    macros: { protein: "4g", carbs: "15g", fat: "6g" },
    moods: ["comfort", "healthy"],
    image: "https://images.unsplash.com/photo-1515823664811-07f9b0642e11?auto=format&fit=crop&q=80&w=800",
    tags: ["Hot/Cold"],
    dietary: ['veg', 'gf'],
    allergens: ['dairy'],
    options: [
      { name: "Temperature", choices: ["Hot", "Iced"] },
      { name: "Milk", choices: ["Oat", "Almond", "Soy", "Dairy"] }
    ],
    pairings: ["5", "6"],
    instructions: ["Whisk 2g Matcha with 40ml hot water.", "Steam milk to 65°C.", "Pour latte art."],
    translations: {
      es: { name: "Matcha Latte", description: "Matcha ceremonial con leche de avena." },
      fr: { name: "Latte au Matcha", description: "Matcha de qualité cérémonielle au lait d'avoine." }
    }
  },
  {
    id: "5",
    name: "Basque Burnt Cheesecake",
    price: 12,
    category: "dessert",
    station: "kitchen",
    description: "Creamy, caramelized cheesecake with a perfectly burnt top layer.",
    ingredients: "Cream Cheese, Heavy Cream, Sugar, Eggs, Vanilla",
    calories: "550 kcal",
    macros: { protein: "10g", carbs: "45g", fat: "35g" },
    moods: ["indulgent", "comfort"],
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800",
    tags: ["Gluten Free"],
    dietary: ['veg', 'gf'],
    allergens: ['dairy', 'egg'],
    options: [],
    pairings: ["3", "4"],
    instructions: ["Slice a generous wedge.", "Plate with berry compote on the side.", "Dust lightly with powdered sugar."],
    translations: {
      es: { name: "Tarta de Queso Vasca", description: "Cremosa y caramelizada." },
      fr: { name: "Gâteau au Fromage Basque", description: "Crémeux et caramélisé." }
    }
  },
  {
    id: "6",
    name: "Acai Super Bowl",
    price: 15,
    category: "dessert",
    station: "kitchen",
    description: "Frozen acai berry base topped with granola, fresh fruits, and chia seeds.",
    ingredients: "Acai, Granola, Blueberries, Strawberries, Banana, Chia",
    calories: "400 kcal",
    macros: { protein: "8g", carbs: "65g", fat: "12g" },
    moods: ["healthy", "energizing"],
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800",
    tags: ["Vegan"],
    dietary: ['veg', 'vegan', 'gf'],
    allergens: ['nuts'],
    options: [
      { name: "Extra Topping", choices: ["None", "Peanut Butter (+$1)", "Honey", "Coconut Flakes"] }
    ],
    pairings: ["4"],
    instructions: ["Blend frozen acai packs.", "Pour into chilled bowl.", "Arrange toppings in neat rows."],
    translations: {
      es: { name: "Bol de Acai", description: "Base de acai con frutas y granola." },
      fr: { name: "Bol d'açaï", description: "Base d'açaï glacée avec granola et fruits." }
    }
  },
];
