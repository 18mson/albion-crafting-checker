// Albion Online Data API integration
const API_BASE_URLS = {
  'West': 'https://west.albion-online-data.com/api/v2/stats',
  'East': 'https://east.albion-online-data.com/api/v2/stats',
  'Europe': 'https://europe.albion-online-data.com/api/v2/stats',
} as const;

export type Server = keyof typeof API_BASE_URLS;

export const SERVERS: Server[] = ['West', 'East', 'Europe'];

export interface MarketData {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  sell_price_max: number;
  sell_price_max_date: string;
  buy_price_min: number;
  buy_price_min_date: string;
  buy_price_max: number;
  buy_price_max_date: string;
}

export interface ItemSearchResult {
  id: string;
  name: string;
  tier: number;
  enchantment: number;
}

// Common Albion Online cities
export const CITIES = [
  'Caerleon',
  'Bridgewatch',
  'Fort Sterling',
  'Lymhurst',
  'Martlock',
  'Thetford',
  'Brecilien',
  'Black Market'
] as const;

export type City = typeof CITIES[number];

// Item categories for better organization
export const ITEM_CATEGORIES = {
  'Weapons': {
    'Swords': ['T4_SWORD', 'T5_SWORD', 'T6_SWORD', 'T7_SWORD', 'T8_SWORD'],
    'Axes': ['T4_AXE', 'T5_AXE', 'T6_AXE', 'T7_AXE', 'T8_AXE'],
    'Maces': ['T4_MACE', 'T5_MACE', 'T6_MACE', 'T7_MACE', 'T8_MACE'],
    'Spears': ['T4_SPEAR', 'T5_SPEAR', 'T6_SPEAR', 'T7_SPEAR', 'T8_SPEAR'],
    'Bows': ['T4_BOW', 'T5_BOW', 'T6_BOW', 'T7_BOW', 'T8_BOW'],
    'Crossbows': ['T4_CROSSBOW', 'T5_CROSSBOW', 'T6_CROSSBOW', 'T7_CROSSBOW', 'T8_CROSSBOW'],
    'Daggers': ['T4_DAGGER', 'T5_DAGGER', 'T6_DAGGER', 'T7_DAGGER', 'T8_DAGGER'],
    'Staves': ['T4_FIRESTAFF', 'T5_FIRESTAFF', 'T6_FIRESTAFF', 'T7_FIRESTAFF', 'T8_FIRESTAFF'],
  },
  'Armor': {
    'Cloth Armor': ['T4_ARMOR_CLOTH_SET1', 'T5_ARMOR_CLOTH_SET1', 'T6_ARMOR_CLOTH_SET1', 'T7_ARMOR_CLOTH_SET1', 'T8_ARMOR_CLOTH_SET1'],
    'Leather Armor': ['T4_ARMOR_LEATHER_SET1', 'T5_ARMOR_LEATHER_SET1', 'T6_ARMOR_LEATHER_SET1', 'T7_ARMOR_LEATHER_SET1', 'T8_ARMOR_LEATHER_SET1'],
    'Plate Armor': ['T4_ARMOR_PLATE_SET1', 'T5_ARMOR_PLATE_SET1', 'T6_ARMOR_PLATE_SET1', 'T7_ARMOR_PLATE_SET1', 'T8_ARMOR_PLATE_SET1'],
  },
  'Accessories': {
    'Bags': ['T4_BAG', 'T5_BAG', 'T6_BAG', 'T7_BAG', 'T8_BAG'],
    'Capes': ['T4_CAPE', 'T5_CAPE', 'T6_CAPE', 'T7_CAPE', 'T8_CAPE'],
    'Tools': ['T4_TOOL_PICKAXE', 'T5_TOOL_PICKAXE', 'T6_TOOL_PICKAXE', 'T7_TOOL_PICKAXE', 'T8_TOOL_PICKAXE'],
  },
  'Materials': {
    'Refined Materials': ['T4_LEATHER', 'T5_LEATHER', 'T6_LEATHER', 'T7_LEATHER', 'T8_LEATHER', 'T4_CLOTH', 'T5_CLOTH', 'T6_CLOTH', 'T7_CLOTH', 'T8_CLOTH'],
    'Metal Bars': ['T4_METALBAR', 'T5_METALBAR', 'T6_METALBAR', 'T7_METALBAR', 'T8_METALBAR'],
    'Planks': ['T4_PLANKS', 'T5_PLANKS', 'T6_PLANKS', 'T7_PLANKS', 'T8_PLANKS'],
    'Stone Blocks': ['T4_STONEBLOCK', 'T5_STONEBLOCK', 'T6_STONEBLOCK', 'T7_STONEBLOCK', 'T8_STONEBLOCK'],
  },
  'Consumables': {
    'Food': ['T4_MEAL_SOUP', 'T5_MEAL_SOUP', 'T6_MEAL_SOUP', 'T7_MEAL_SOUP', 'T8_MEAL_SOUP'],
    'Potions': ['T4_POTION_HEAL', 'T5_POTION_HEAL', 'T6_POTION_HEAL', 'T7_POTION_HEAL', 'T8_POTION_HEAL'],
  }
} as const;

export type ItemCategory = keyof typeof ITEM_CATEGORIES;
export type ItemSubcategory<T extends ItemCategory> = keyof typeof ITEM_CATEGORIES[T];

// Fetch market data for specific items
export async function fetchMarketData(
  itemIds: string[],
  server: Server = 'West',
  cities: City[] = ['Caerleon'],
  qualities: number[] = [1]
): Promise<MarketData[]> {
  try {
    const params = new URLSearchParams();
    params.append('locations', cities.join(','));
    params.append('qualities', qualities.join(','));
    
    const url = `${API_BASE_URLS[server]}/prices/${itemIds.join(',')}?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

// Search for items by name (simplified - in real app you'd have a complete item database)
export const COMMON_ITEMS: Record<string, ItemSearchResult> = {
  // Bags
  'T4_BAG': { id: 'T4_BAG', name: 'Adept\'s Bag', tier: 4, enchantment: 0 },
  'T5_BAG': { id: 'T5_BAG', name: 'Expert\'s Bag', tier: 5, enchantment: 0 },
  'T6_BAG': { id: 'T6_BAG', name: 'Master\'s Bag', tier: 6, enchantment: 0 },
  'T7_BAG': { id: 'T7_BAG', name: 'Grandmaster\'s Bag', tier: 7, enchantment: 0 },
  'T8_BAG': { id: 'T8_BAG', name: 'Elder\'s Bag', tier: 8, enchantment: 0 },
  
  // Materials - Leather
  'T4_LEATHER': { id: 'T4_LEATHER', name: 'Adept\'s Leather', tier: 4, enchantment: 0 },
  'T5_LEATHER': { id: 'T5_LEATHER', name: 'Expert\'s Leather', tier: 5, enchantment: 0 },
  'T6_LEATHER': { id: 'T6_LEATHER', name: 'Master\'s Leather', tier: 6, enchantment: 0 },
  'T7_LEATHER': { id: 'T7_LEATHER', name: 'Grandmaster\'s Leather', tier: 7, enchantment: 0 },
  'T8_LEATHER': { id: 'T8_LEATHER', name: 'Elder\'s Leather', tier: 8, enchantment: 0 },
  
  // Materials - Cloth
  'T4_CLOTH': { id: 'T4_CLOTH', name: 'Adept\'s Cloth', tier: 4, enchantment: 0 },
  'T5_CLOTH': { id: 'T5_CLOTH', name: 'Expert\'s Cloth', tier: 5, enchantment: 0 },
  'T6_CLOTH': { id: 'T6_CLOTH', name: 'Master\'s Cloth', tier: 6, enchantment: 0 },
  'T7_CLOTH': { id: 'T7_CLOTH', name: 'Grandmaster\'s Cloth', tier: 7, enchantment: 0 },
  'T8_CLOTH': { id: 'T8_CLOTH', name: 'Elder\'s Cloth', tier: 8, enchantment: 0 },
  
  // Materials - Metal
  'T4_METALBAR': { id: 'T4_METALBAR', name: 'Adept\'s Metal Bar', tier: 4, enchantment: 0 },
  'T5_METALBAR': { id: 'T5_METALBAR', name: 'Expert\'s Metal Bar', tier: 5, enchantment: 0 },
  'T6_METALBAR': { id: 'T6_METALBAR', name: 'Master\'s Metal Bar', tier: 6, enchantment: 0 },
  'T7_METALBAR': { id: 'T7_METALBAR', name: 'Grandmaster\'s Metal Bar', tier: 7, enchantment: 0 },
  'T8_METALBAR': { id: 'T8_METALBAR', name: 'Elder\'s Metal Bar', tier: 8, enchantment: 0 },
  
  // Materials - Wood
  'T4_PLANKS': { id: 'T4_PLANKS', name: 'Adept\'s Planks', tier: 4, enchantment: 0 },
  'T5_PLANKS': { id: 'T5_PLANKS', name: 'Expert\'s Planks', tier: 5, enchantment: 0 },
  'T6_PLANKS': { id: 'T6_PLANKS', name: 'Master\'s Planks', tier: 6, enchantment: 0 },
  'T7_PLANKS': { id: 'T7_PLANKS', name: 'Grandmaster\'s Planks', tier: 7, enchantment: 0 },
  'T8_PLANKS': { id: 'T8_PLANKS', name: 'Elder\'s Planks', tier: 8, enchantment: 0 },
  
  // Materials - Stone
  'T4_STONEBLOCK': { id: 'T4_STONEBLOCK', name: 'Adept\'s Stone Block', tier: 4, enchantment: 0 },
  'T5_STONEBLOCK': { id: 'T5_STONEBLOCK', name: 'Expert\'s Stone Block', tier: 5, enchantment: 0 },
  'T6_STONEBLOCK': { id: 'T6_STONEBLOCK', name: 'Master\'s Stone Block', tier: 6, enchantment: 0 },
  'T7_STONEBLOCK': { id: 'T7_STONEBLOCK', name: 'Grandmaster\'s Stone Block', tier: 7, enchantment: 0 },
  'T8_STONEBLOCK': { id: 'T8_STONEBLOCK', name: 'Elder\'s Stone Block', tier: 8, enchantment: 0 },
  
  // Weapons - Swords
  'T4_SWORD': { id: 'T4_SWORD', name: 'Adept\'s Broadsword', tier: 4, enchantment: 0 },
  'T5_SWORD': { id: 'T5_SWORD', name: 'Expert\'s Broadsword', tier: 5, enchantment: 0 },
  'T6_SWORD': { id: 'T6_SWORD', name: 'Master\'s Broadsword', tier: 6, enchantment: 0 },
  'T7_SWORD': { id: 'T7_SWORD', name: 'Grandmaster\'s Broadsword', tier: 7, enchantment: 0 },
  'T8_SWORD': { id: 'T8_SWORD', name: 'Elder\'s Broadsword', tier: 8, enchantment: 0 },
  
  // Weapons - Axes
  'T4_AXE': { id: 'T4_AXE', name: 'Adept\'s Battleaxe', tier: 4, enchantment: 0 },
  'T5_AXE': { id: 'T5_AXE', name: 'Expert\'s Battleaxe', tier: 5, enchantment: 0 },
  'T6_AXE': { id: 'T6_AXE', name: 'Master\'s Battleaxe', tier: 6, enchantment: 0 },
  'T7_AXE': { id: 'T7_AXE', name: 'Grandmaster\'s Battleaxe', tier: 7, enchantment: 0 },
  'T8_AXE': { id: 'T8_AXE', name: 'Elder\'s Battleaxe', tier: 8, enchantment: 0 },
  
  // Weapons - Maces
  'T4_MACE': { id: 'T4_MACE', name: 'Adept\'s Mace', tier: 4, enchantment: 0 },
  'T5_MACE': { id: 'T5_MACE', name: 'Expert\'s Mace', tier: 5, enchantment: 0 },
  'T6_MACE': { id: 'T6_MACE', name: 'Master\'s Mace', tier: 6, enchantment: 0 },
  'T7_MACE': { id: 'T7_MACE', name: 'Grandmaster\'s Mace', tier: 7, enchantment: 0 },
  'T8_MACE': { id: 'T8_MACE', name: 'Elder\'s Mace', tier: 8, enchantment: 0 },
  
  // Weapons - Spears
  'T4_SPEAR': { id: 'T4_SPEAR', name: 'Adept\'s Spear', tier: 4, enchantment: 0 },
  'T5_SPEAR': { id: 'T5_SPEAR', name: 'Expert\'s Spear', tier: 5, enchantment: 0 },
  'T6_SPEAR': { id: 'T6_SPEAR', name: 'Master\'s Spear', tier: 6, enchantment: 0 },
  'T7_SPEAR': { id: 'T7_SPEAR', name: 'Grandmaster\'s Spear', tier: 7, enchantment: 0 },
  'T8_SPEAR': { id: 'T8_SPEAR', name: 'Elder\'s Spear', tier: 8, enchantment: 0 },
  
  // Weapons - Bows
  'T4_BOW': { id: 'T4_BOW', name: 'Adept\'s Bow', tier: 4, enchantment: 0 },
  'T5_BOW': { id: 'T5_BOW', name: 'Expert\'s Bow', tier: 5, enchantment: 0 },
  'T6_BOW': { id: 'T6_BOW', name: 'Master\'s Bow', tier: 6, enchantment: 0 },
  'T7_BOW': { id: 'T7_BOW', name: 'Grandmaster\'s Bow', tier: 7, enchantment: 0 },
  'T8_BOW': { id: 'T8_BOW', name: 'Elder\'s Bow', tier: 8, enchantment: 0 },
  
  // Weapons - Crossbows
  'T4_CROSSBOW': { id: 'T4_CROSSBOW', name: 'Adept\'s Crossbow', tier: 4, enchantment: 0 },
  'T5_CROSSBOW': { id: 'T5_CROSSBOW', name: 'Expert\'s Crossbow', tier: 5, enchantment: 0 },
  'T6_CROSSBOW': { id: 'T6_CROSSBOW', name: 'Master\'s Crossbow', tier: 6, enchantment: 0 },
  'T7_CROSSBOW': { id: 'T7_CROSSBOW', name: 'Grandmaster\'s Crossbow', tier: 7, enchantment: 0 },
  'T8_CROSSBOW': { id: 'T8_CROSSBOW', name: 'Elder\'s Crossbow', tier: 8, enchantment: 0 },
  
  // Weapons - Daggers
  'T4_DAGGER': { id: 'T4_DAGGER', name: 'Adept\'s Dagger', tier: 4, enchantment: 0 },
  'T5_DAGGER': { id: 'T5_DAGGER', name: 'Expert\'s Dagger', tier: 5, enchantment: 0 },
  'T6_DAGGER': { id: 'T6_DAGGER', name: 'Master\'s Dagger', tier: 6, enchantment: 0 },
  'T7_DAGGER': { id: 'T7_DAGGER', name: 'Grandmaster\'s Dagger', tier: 7, enchantment: 0 },
  'T8_DAGGER': { id: 'T8_DAGGER', name: 'Elder\'s Dagger', tier: 8, enchantment: 0 },
  
  // Weapons - Staves
  'T4_FIRESTAFF': { id: 'T4_FIRESTAFF', name: 'Adept\'s Fire Staff', tier: 4, enchantment: 0 },
  'T5_FIRESTAFF': { id: 'T5_FIRESTAFF', name: 'Expert\'s Fire Staff', tier: 5, enchantment: 0 },
  'T6_FIRESTAFF': { id: 'T6_FIRESTAFF', name: 'Master\'s Fire Staff', tier: 6, enchantment: 0 },
  'T7_FIRESTAFF': { id: 'T7_FIRESTAFF', name: 'Grandmaster\'s Fire Staff', tier: 7, enchantment: 0 },
  'T8_FIRESTAFF': { id: 'T8_FIRESTAFF', name: 'Elder\'s Fire Staff', tier: 8, enchantment: 0 },
  
  // Armor - Cloth
  'T4_ARMOR_CLOTH_SET1': { id: 'T4_ARMOR_CLOTH_SET1', name: 'Adept\'s Scholar Robe', tier: 4, enchantment: 0 },
  'T5_ARMOR_CLOTH_SET1': { id: 'T5_ARMOR_CLOTH_SET1', name: 'Expert\'s Scholar Robe', tier: 5, enchantment: 0 },
  'T6_ARMOR_CLOTH_SET1': { id: 'T6_ARMOR_CLOTH_SET1', name: 'Master\'s Scholar Robe', tier: 6, enchantment: 0 },
  'T7_ARMOR_CLOTH_SET1': { id: 'T7_ARMOR_CLOTH_SET1', name: 'Grandmaster\'s Scholar Robe', tier: 7, enchantment: 0 },
  'T8_ARMOR_CLOTH_SET1': { id: 'T8_ARMOR_CLOTH_SET1', name: 'Elder\'s Scholar Robe', tier: 8, enchantment: 0 },
  
  // Armor - Leather
  'T4_ARMOR_LEATHER_SET1': { id: 'T4_ARMOR_LEATHER_SET1', name: 'Adept\'s Mercenary Jacket', tier: 4, enchantment: 0 },
  'T5_ARMOR_LEATHER_SET1': { id: 'T5_ARMOR_LEATHER_SET1', name: 'Expert\'s Mercenary Jacket', tier: 5, enchantment: 0 },
  'T6_ARMOR_LEATHER_SET1': { id: 'T6_ARMOR_LEATHER_SET1', name: 'Master\'s Mercenary Jacket', tier: 6, enchantment: 0 },
  'T7_ARMOR_LEATHER_SET1': { id: 'T7_ARMOR_LEATHER_SET1', name: 'Grandmaster\'s Mercenary Jacket', tier: 7, enchantment: 0 },
  'T8_ARMOR_LEATHER_SET1': { id: 'T8_ARMOR_LEATHER_SET1', name: 'Elder\'s Mercenary Jacket', tier: 8, enchantment: 0 },
  
  // Armor - Plate
  'T4_ARMOR_PLATE_SET1': { id: 'T4_ARMOR_PLATE_SET1', name: 'Adept\'s Soldier Armor', tier: 4, enchantment: 0 },
  'T5_ARMOR_PLATE_SET1': { id: 'T5_ARMOR_PLATE_SET1', name: 'Expert\'s Soldier Armor', tier: 5, enchantment: 0 },
  'T6_ARMOR_PLATE_SET1': { id: 'T6_ARMOR_PLATE_SET1', name: 'Master\'s Soldier Armor', tier: 6, enchantment: 0 },
  'T7_ARMOR_PLATE_SET1': { id: 'T7_ARMOR_PLATE_SET1', name: 'Grandmaster\'s Soldier Armor', tier: 7, enchantment: 0 },
  'T8_ARMOR_PLATE_SET1': { id: 'T8_ARMOR_PLATE_SET1', name: 'Elder\'s Soldier Armor', tier: 8, enchantment: 0 },
  
  // Accessories - Capes
  'T4_CAPE': { id: 'T4_CAPE', name: 'Adept\'s Cape', tier: 4, enchantment: 0 },
  'T5_CAPE': { id: 'T5_CAPE', name: 'Expert\'s Cape', tier: 5, enchantment: 0 },
  'T6_CAPE': { id: 'T6_CAPE', name: 'Master\'s Cape', tier: 6, enchantment: 0 },
  'T7_CAPE': { id: 'T7_CAPE', name: 'Grandmaster\'s Cape', tier: 7, enchantment: 0 },
  'T8_CAPE': { id: 'T8_CAPE', name: 'Elder\'s Cape', tier: 8, enchantment: 0 },
  
  // Tools
  'T4_TOOL_PICKAXE': { id: 'T4_TOOL_PICKAXE', name: 'Adept\'s Pickaxe', tier: 4, enchantment: 0 },
  'T5_TOOL_PICKAXE': { id: 'T5_TOOL_PICKAXE', name: 'Expert\'s Pickaxe', tier: 5, enchantment: 0 },
  'T6_TOOL_PICKAXE': { id: 'T6_TOOL_PICKAXE', name: 'Master\'s Pickaxe', tier: 6, enchantment: 0 },
  'T7_TOOL_PICKAXE': { id: 'T7_TOOL_PICKAXE', name: 'Grandmaster\'s Pickaxe', tier: 7, enchantment: 0 },
  'T8_TOOL_PICKAXE': { id: 'T8_TOOL_PICKAXE', name: 'Elder\'s Pickaxe', tier: 8, enchantment: 0 },
  
  // Consumables - Food
  'T4_MEAL_SOUP': { id: 'T4_MEAL_SOUP', name: 'Adept\'s Soup', tier: 4, enchantment: 0 },
  'T5_MEAL_SOUP': { id: 'T5_MEAL_SOUP', name: 'Expert\'s Soup', tier: 5, enchantment: 0 },
  'T6_MEAL_SOUP': { id: 'T6_MEAL_SOUP', name: 'Master\'s Soup', tier: 6, enchantment: 0 },
  'T7_MEAL_SOUP': { id: 'T7_MEAL_SOUP', name: 'Grandmaster\'s Soup', tier: 7, enchantment: 0 },
  'T8_MEAL_SOUP': { id: 'T8_MEAL_SOUP', name: 'Elder\'s Soup', tier: 8, enchantment: 0 },
  
  // Consumables - Potions
  'T4_POTION_HEAL': { id: 'T4_POTION_HEAL', name: 'Adept\'s Healing Potion', tier: 4, enchantment: 0 },
  'T5_POTION_HEAL': { id: 'T5_POTION_HEAL', name: 'Expert\'s Healing Potion', tier: 5, enchantment: 0 },
  'T6_POTION_HEAL': { id: 'T6_POTION_HEAL', name: 'Master\'s Healing Potion', tier: 6, enchantment: 0 },
  'T7_POTION_HEAL': { id: 'T7_POTION_HEAL', name: 'Grandmaster\'s Healing Potion', tier: 7, enchantment: 0 },
  'T8_POTION_HEAL': { id: 'T8_POTION_HEAL', name: 'Elder\'s Healing Potion', tier: 8, enchantment: 0 },
};

export function searchItems(query: string): ItemSearchResult[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(COMMON_ITEMS).filter(item =>
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.id.toLowerCase().includes(lowercaseQuery)
  );
}

export function getItemsByCategory(category: ItemCategory, subcategory?: string): ItemSearchResult[] {
  if (subcategory) {
    const itemIds = ITEM_CATEGORIES[category][subcategory as keyof typeof ITEM_CATEGORIES[typeof category]];
    return (itemIds as readonly string[]).map(id => COMMON_ITEMS[id]).filter(Boolean);
  } else {
    const allItemIds = Object.values(ITEM_CATEGORIES[category]).flat();
    return allItemIds.map(id => COMMON_ITEMS[id]).filter(Boolean);
  }
}

export function getItemById(id: string): ItemSearchResult | undefined {
  return COMMON_ITEMS[id];
}

// Get the best price for an item in a specific city
export function getBestPrice(marketData: MarketData[], type: 'buy' | 'sell' = 'sell'): number {
  if (marketData.length === 0) return 0;
  
  if (type === 'sell') {
    // For selling, we want the minimum sell price (what we can realistically get)
    const validPrices = marketData
      .filter(data => data.sell_price_min > 0)
      .map(data => data.sell_price_min);
    
    return validPrices.length > 0 ? Math.min(...validPrices) : 0;
  } else {
    // For buying materials, we want the minimum buy price (cheapest we can buy)
    const validPrices = marketData
      .filter(data => data.buy_price_max > 0)
      .map(data => data.buy_price_max);
    
    return validPrices.length > 0 ? Math.min(...validPrices) : 0;
  }
}

// Format price with silver notation
export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}K`;
  }
  return price.toString();
}