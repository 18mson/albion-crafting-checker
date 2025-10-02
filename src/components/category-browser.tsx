"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { ChevronDown, ChevronRight, Sword, Shield, Package, Hammer, Utensils } from 'lucide-react';
import { ITEM_CATEGORIES, getItemsByCategory, formatPrice, type ItemCategory, type ItemSearchResult } from '../lib/albion-api';

interface CategoryBrowserProps {
  onItemSelect: (item: ItemSearchResult, price?: number) => void;
  prices?: Record<string, number>;
}

const categoryIcons = {
  'Weapons': Sword,
  'Armor': Shield,
  'Accessories': Package,
  'Materials': Hammer,
  'Consumables': Utensils,
};

export function CategoryBrowser({ onItemSelect, prices = {} }: CategoryBrowserProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('Weapons');

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
  };

  const handleItemClick = (item: ItemSearchResult) => {
    const price = prices[item.id] || 0;
    onItemSelect(item, price);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Browse Items by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ItemCategory)}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
              <SelectValue placeholder="Select a category">
                <div className="flex items-center gap-2">
                  {React.createElement(categoryIcons[selectedCategory], { className: "w-4 h-4" })}
                  {selectedCategory}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ITEM_CATEGORIES).map((category) => {
                const Icon = categoryIcons[category as ItemCategory];
                return (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {category}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {Object.entries(ITEM_CATEGORIES[selectedCategory]).map(([subcategory, itemIds]) => (
            <Collapsible
              key={subcategory}
              open={expandedCategory === `${selectedCategory}-${subcategory}`}
              onOpenChange={() => toggleCategory(`${selectedCategory}-${subcategory}`)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <span className="font-medium">{subcategory}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{itemIds.length} items</Badge>
                    {expandedCategory === `${selectedCategory}-${subcategory}` ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="grid grid-cols-1 gap-2 pl-4">
                  {getItemsByCategory(selectedCategory, subcategory).map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => handleItemClick(item)}
                      className="justify-between h-auto p-3 text-left w-full"
                    >
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Tier {item.tier} • {item.id}
                        </div>
                      </div>
                      {prices[item.id] ? (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400">
                          {formatPrice(prices[item.id])}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400">
                          No data
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}