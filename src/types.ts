export interface CoffeeItem {
  id: string;
  name: string;
  category: 'celestial-hot' | 'umbra-cold' | 'eclipse-signature' | 'gothic-elixir' | 'shadow-confection';
  description: string;
  price: number;
  image: string;
  intensity: number; // 1-5 scale
  sweetness: number; // 1-5 scale
  mysticalIngredient?: string;
  caffeineMg?: number;
  temperature: 'hot' | 'cold' | 'both';
}

export interface CartItem {
  coffee: CoffeeItem;
  quantity: number;
  customization?: CoffeeCustomization;
}

export interface CoffeeCustomization {
  milk: 'Whole' | 'Oat' | 'Charcoal Activated' | 'Coconut' | 'None';
  sweetener: 'Dark Maple' | 'Lavender Infused' | 'Organic Demerara' | 'None';
  toppings: string[]; // Options: Gold flakes, Star anise, Rose petals, Sea salt aura, Cinnamon lunar dust
  tempAdjust: 'regular' | 'extra-hot' | 'over-ice';
}

export type LunarPhase = 'new-moon' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full-moon' | 'eclipse';

export interface SeanceBooking {
  name: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  timeSlot: string;
  chamber: 'Solar-Chamber' | 'Umbral-Tomb' | 'Lunar-Balcony';
}
