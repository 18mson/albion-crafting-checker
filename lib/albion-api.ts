import { AlbionItem } from './types';

let cachedItems: AlbionItem[] | null = null;

export async function fetchAlbionItems(): Promise<AlbionItem[]> {
  if (cachedItems) {
    return cachedItems;
  }

  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.json'
    );
    const data: AlbionItem[] = await response.json();
    cachedItems = data.filter(item => item.LocalizedNames && item.LocalizedNames['EN-US']);
    return cachedItems;
  } catch (error) {
    console.error('Failed to fetch Albion items:', error);
    return [];
  }
}

export function searchItems(items: AlbionItem[], query: string): AlbionItem[] {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  return items
    .filter(item => {
      const name = item.LocalizedNames['EN-US']?.toLowerCase() || '';
      const uniqueName = item.UniqueName?.toLowerCase() || '';
      return name.includes(lowerQuery) || uniqueName.includes(lowerQuery);
    })
    .slice(0, 50);
}
