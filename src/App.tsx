"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Plus, Minus, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { ThemeToggle } from './components/theme-toggle';
import { ItemSearch } from './components/item-search';
import { CitySelector } from './components/city-selector';
import { ServerTabs } from './components/server-tabs';
import { fetchMarketData, getBestPrice, type City, type Server } from './lib/albion-api';

interface Material {
  id: string;
  name: string;
  itemId?: string;
  quantity: number;
  unitPrice: number;
}

interface CalculationResult {
  totalMaterialCost: number;
  netMaterialCost: number;
  grossSalePrice: number;
  netSalePrice: number;
  totalProfit: number;
  isProfitable: boolean;
  profitMargin: number;
}

export default function AlbionCalculator() {
  const [itemName, setItemName] = useState('T4 Bag');
  const [selectedItemId, setSelectedItemId] = useState('T4_BAG');
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'T4 Leather', itemId: 'T4_LEATHER', quantity: 16, unitPrice: 1000 },
    { id: '2', name: 'T4 Cloth', itemId: 'T4_CLOTH', quantity: 8, unitPrice: 1200 },
  ]);
  const [selectedServer, setSelectedServer] = useState<Server>('West');
  const [selectedCity, setSelectedCity] = useState<City>('Caerleon');
  const [returnBonus, setReturnBonus] = useState(48);
  const [craftingFee, setCraftingFee] = useState(2000);
  const [sellPrice, setSellPrice] = useState(20000);
  const [taxRate, setTaxRate] = useState(6.5);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: '',
      itemId: undefined,
      quantity: 1,
      unitPrice: 0,
    };
    setMaterials([...materials, newMaterial]);
  };

  const removeMaterial = (id: string) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(material => material.id !== id));
    }
  };

  const updateMaterial = (id: string, field: keyof Material, value: string | number) => {
    setMaterials(materials.map(material => 
      material.id === id ? { ...material, [field]: value } : material
    ));
  };

  const updateItemPrice = async () => {
    if (!selectedItemId) return;
    
    setLoading(true);
    try {
      const marketData = await fetchMarketData([selectedItemId], selectedServer, [selectedCity]);
      const price = getBestPrice(marketData, 'sell');
      if (price > 0) {
        setSellPrice(price);
      }
    } catch (error) {
      console.error('Error fetching item price:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMaterialPrices = async () => {
    const materialsWithIds = materials.filter(m => m.itemId);
    if (materialsWithIds.length === 0) return;

    setLoading(true);
    try {
      const itemIds = materialsWithIds.map(m => m.itemId!);
      const marketData = await fetchMarketData(itemIds, selectedServer, [selectedCity]);
      
      const updatedMaterials = materials.map(material => {
        if (material.itemId) {
          const itemMarketData = marketData.filter(data => data.item_id === material.itemId);
          const price = getBestPrice(itemMarketData, 'buy');
          return price > 0 ? { ...material, unitPrice: price } : material;
        }
        return material;
      });
      
      setMaterials(updatedMaterials);
    } catch (error) {
      console.error('Error fetching material prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = () => {
    const totalMaterialCost = materials.reduce((sum, material) => 
      sum + (material.quantity * material.unitPrice), 0
    );
    
    const netMaterialCost = totalMaterialCost * (1 - returnBonus / 100);
    const netSalePrice = sellPrice * (1 - taxRate / 100);
    const totalProfit = netSalePrice - netMaterialCost - craftingFee;
    const isProfitable = totalProfit > 0;
    const profitMargin = ((totalProfit / sellPrice) * 100);

    const calculationResult: CalculationResult = {
      totalMaterialCost,
      netMaterialCost,
      grossSalePrice: sellPrice,
      netSalePrice,
      totalProfit,
      isProfitable,
      profitMargin,
    };

    setResult(calculationResult);
  };

  useEffect(() => {
    calculateProfit();
  }, [materials, returnBonus, craftingFee, sellPrice, taxRate]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header with Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Calculator className="text-blue-600 dark:text-blue-400" />
            Albion Online Crafting Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Calculate crafting profits with detailed breakdowns including taxes, bonuses, and fees
          </p>
          
          {/* Server Selection */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Server Region</span>
            </div>
            <ServerTabs
              value={selectedServer}
              onValueChange={setSelectedServer}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
            <CardHeader className="bg-blue-50/50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Crafting Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Crafted Item
                </Label>
                <ItemSearch
                  placeholder="Search for items to craft..."
                  type="item"
                 server={selectedServer}
                  selectedCity={selectedCity}
                  onItemSelect={(item, price) => {
                    setItemName(item.name);
                    setSelectedItemId(item.id);
                    if (price > 0) setSellPrice(price);
                  }}
                />
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Market City
                </Label>
                <div className="flex gap-2">
                  <CitySelector
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                  />
                  <Button
                    onClick={updateItemPrice}
                    variant="outline"
                    size="sm"
                    disabled={loading || !selectedItemId}
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Update Item Price
                  </Button>
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Materials</Label>
                  <div className="flex gap-2">
                    <Button
                      onClick={updateMaterialPrices}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      Update Prices
                    </Button>
                    <Button
                      onClick={addMaterial}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Material
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {materials.map((material) => (
                    <div key={material.id} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex-1">
                        <ItemSearch
                          placeholder="Search materials..."
                          type="material"
                         server={selectedServer}
                          selectedCity={selectedCity}
                          onItemSelect={(item, price) => {
                            setMaterials(materials.map(m => 
                              m.id === material.id 
                                ? { ...m, name: item.name, itemId: item.id, unitPrice: price > 0 ? price : m.unitPrice }
                                : m
                            ));
                          }}
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(material.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={material.unitPrice}
                        onChange={(e) => updateMaterial(material.id, 'unitPrice', parseInt(e.target.value) || 0)}
                        className="w-28 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                      />
                      <Button
                        onClick={() => removeMaterial(material.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={materials.length === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonuses and Fees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="returnBonus" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Return Bonus (%)
                  </Label>
                  <Input
                    id="returnBonus"
                    type="number"
                    value={returnBonus}
                    onChange={(e) => setReturnBonus(parseFloat(e.target.value) || 0)}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="craftingFee" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Crafting Fee
                  </Label>
                  <Input
                    id="craftingFee"
                    type="number"
                    value={craftingFee}
                    onChange={(e) => setCraftingFee(parseInt(e.target.value) || 0)}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sellPrice" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Market Sell Price
                  </Label>
                  <Input
                    id="sellPrice"
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(parseInt(e.target.value) || 0)}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Tax Rate (%)
                  </Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-xl text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Profit Analysis: {itemName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {result && (
                <div className="space-y-6">
                  {/* Profit Summary */}
                  <div className={`p-4 rounded-lg border-2 ${
                    result.isProfitable 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Total Profit</span>
                      <div className="flex items-center gap-2">
                        {result.isProfitable ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <Badge 
                          variant={result.isProfitable ? "default" : "destructive"}
                          className="text-lg px-3 py-1"
                        >
                          {formatNumber(result.totalProfit)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Profit Margin</span>
                      <span className={result.isProfitable ? 'text-green-600' : 'text-red-600'}>
                        {result.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Calculation Breakdown</h3>
                    
                    {/* Revenue */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Gross Sale Price</span>
                        <span className="font-medium">{formatNumber(result.grossSalePrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-500 ml-4">- Tax ({taxRate}%)</span>
                        <span className="text-red-600">-{formatNumber(result.grossSalePrice - result.netSalePrice)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-slate-700 dark:text-slate-300">Net Sale Price</span>
                        <span className="text-green-600">{formatNumber(result.netSalePrice)}</span>
                      </div>
                    </div>

                    {/* Costs */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Material Cost</span>
                        <span className="font-medium">{formatNumber(result.totalMaterialCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-500 ml-4">- Return Bonus ({returnBonus}%)</span>
                        <span className="text-green-600">-{formatNumber(result.totalMaterialCost - result.netMaterialCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Net Material Cost</span>
                        <span className="text-red-600">{formatNumber(result.netMaterialCost)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-slate-600 dark:text-slate-400">Crafting Fee</span>
                        <span className="text-red-600">{formatNumber(craftingFee)}</span>
                      </div>
                    </div>

                    {/* Materials Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">Material Details</h4>
                      {materials.map((material) => (
                        <div key={material.id} className="flex justify-between text-sm bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-600 dark:text-slate-400">
                            {material.name} ({material.quantity}x @ {formatNumber(material.unitPrice)})
                          </span>
                          <span className="font-medium">
                            {formatNumber(material.quantity * material.unitPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Result */}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Final Profit</span>
                    <span className={result.isProfitable ? 'text-green-600' : 'text-red-600'}>
                      {formatNumber(result.totalProfit)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Crafting Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">Return Bonuses</h4>
                <p>Thetford: 48% refining bonus</p>
                <p>Focus: 15%+ additional return</p>
                <p>High-tier stations: More bonuses</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">Tax Rates</h4>
                <p>Base tax: 6.5%</p>
                <p>Premium: 4%</p>
                <p>Personal islands: 0%</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">Profit Tips</h4>
                <p>Use focus for better returns</p>
                <p>Craft in specialized cities</p>
                <p>Check market prices regularly</p>
                <p>API data updates every 5 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}