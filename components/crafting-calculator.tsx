'use client';

import { useState, useEffect } from 'react';
import { AlbionItem, Material } from '@/lib/types';
import { fetchAlbionItems, searchItems } from '@/lib/albion-api';
import { calculateProfit } from '@/lib/calculations';
import { ItemSearch } from './item-search';
import { MaterialList } from './material-list';
import { ProfitDisplay } from './profit-display';
import { Card } from './ui/card';

export function CraftingCalculator() {
  const [items, setItems] = useState<AlbionItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AlbionItem | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [craftingFee, setCraftingFee] = useState<number>(0);
  const [setupFee, setSetupFee] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      const data = await fetchAlbionItems();
      setItems(data);
      setLoading(false);
    }
    loadItems();
  }, []);

  const handleItemSelect = (item: AlbionItem) => {
    setSelectedItem(item);
    if (materials.length === 0) {
      setMaterials([{ itemName: '', quantity: 1, pricePerUnit: 0 }]);
    }
  };

  const calculation = calculateProfit(
    materials,
    craftingFee,
    setupFee,
    salePrice,
    taxRate
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Albion Crafting Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your crafting profits in Albion Online
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Item</h2>
              <ItemSearch
                items={items}
                onSelectItem={handleItemSelect}
                loading={loading}
              />
              {selectedItem && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Selected Item</p>
                  <p className="font-medium text-lg">
                    {selectedItem.LocalizedNames['EN-US']}
                  </p>
                </div>
              )}
            </Card>

            <MaterialList
              materials={materials}
              setMaterials={setMaterials}
              craftingFee={craftingFee}
              setCraftingFee={setCraftingFee}
              setupFee={setupFee}
              setSetupFee={setSetupFee}
              salePrice={salePrice}
              setSalePrice={setSalePrice}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
            />
          </div>

          <div className="lg:col-span-1">
            <ProfitDisplay calculation={calculation} />
          </div>
        </div>
      </div>
    </div>
  );
}
