"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Loader as Loader2, TrendingUp, TrendingDown, List } from 'lucide-react';
import { searchItems, fetchMarketData, getBestPrice, formatPrice, CITIES, type ItemSearchResult, type MarketData, type City } from '../lib/albion-api';
import { CategoryBrowser } from './category-browser';

interface ItemSearchProps {
  onItemSelect: (item: ItemSearchResult, price: number) => void;
  placeholder?: string;
  type?: 'item' | 'material';
  server?: Server;
  selectedCity?: City;
}

export function ItemSearch({ onItemSelect, placeholder = "Search items...", type = 'item', server = 'West', selectedCity = 'Caerleon' }: ItemSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ItemSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Fetch prices for category browser
  useEffect(() => {
    // This could be expanded to fetch prices for all visible items in categories
  }, [server, selectedCity]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchResults = searchItems(query);
    setResults(searchResults.slice(0, 10)); // Limit to 10 results
    setShowResults(true);

    // Fetch prices for search results
    if (searchResults.length > 0) {
      fetchPricesForItems(searchResults);
    }
  }, [query, server, selectedCity]);

  const fetchPricesForItems = async (items: ItemSearchResult[]) => {
    setLoading(true);
    try {
      const itemIds = items.map(item => item.id);
      const marketData = await fetchMarketData(itemIds, server, [selectedCity]);
      
      const priceMap: Record<string, number> = {};
      items.forEach(item => {
        const itemMarketData = marketData.filter(data => data.item_id === item.id);
        const price = getBestPrice(itemMarketData, type === 'material' ? 'buy' : 'sell');
        priceMap[item.id] = price;
      });
      
      setPrices(priceMap);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item: ItemSearchResult) => {
    const price = prices[item.id] || 0;
    onItemSelect(item, price);
    setQuery(item.name);
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Browse
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="pl-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                onFocus={() => query.length >= 2 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 animate-spin" />
              )}
            </div>

            {showResults && results.length > 0 && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto shadow-lg border-slate-200 dark:border-slate-700">
                <CardContent className="p-0">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {item.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {item.id} • Tier {item.tier}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {prices[item.id] ? (
                          <Badge variant="outline" className="text-green-600 dark:text-green-400">
                            {formatPrice(prices[item.id])}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400">
                            No data
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="browse" className="mt-4">
          <CategoryBrowser
            onItemSelect={(item, price) => {
              onItemSelect(item, price || 0);
            }}
            prices={prices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}