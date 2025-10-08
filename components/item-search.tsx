'use client';

import { useState, useMemo } from 'react';
import { AlbionItem } from '@/lib/types';
import { searchItems } from '@/lib/albion-api';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Search } from 'lucide-react';

interface ItemSearchProps {
  items: AlbionItem[];
  onSelectItem: (item: AlbionItem) => void;
  loading: boolean;
}

export function ItemSearch({ items, onSelectItem, loading }: ItemSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    return searchItems(items, query);
  }, [items, query]);

  const handleSelect = (item: AlbionItem) => {
    onSelectItem(item);
    setQuery(item.LocalizedNames['EN-US']);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={loading ? "Loading items..." : "Search for an item..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          disabled={loading}
          className="pl-10"
        />
      </div>

      {showResults && query && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg">
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {results.map((item) => (
                <button
                  key={item.UniqueName}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-accent transition-colors"
                >
                  <div className="font-medium text-sm">
                    {item.LocalizedNames['EN-US']}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.UniqueName}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
