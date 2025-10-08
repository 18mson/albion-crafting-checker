'use client';

import { Material } from '@/lib/types';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface MaterialListProps {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  craftingFee: number;
  setCraftingFee: (fee: number) => void;
  setupFee: number;
  setSetupFee: (fee: number) => void;
  salePrice: number;
  setSalePrice: (price: number) => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

export function MaterialList({
  materials,
  setMaterials,
  craftingFee,
  setCraftingFee,
  setupFee,
  setSetupFee,
  salePrice,
  setSalePrice,
  taxRate,
  setTaxRate,
}: MaterialListProps) {
  const addMaterial = () => {
    setMaterials([...materials, { itemName: '', quantity: 1, pricePerUnit: 0 }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Materials & Costs</h2>
        <Button onClick={addMaterial} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </div>

      <div className="space-y-4">
        {materials.map((material, index) => (
          <div key={index} className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Material {index + 1}</h3>
              {materials.length > 1 && (
                <Button
                  onClick={() => removeMaterial(index)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <Label htmlFor={`name-${index}`} className="text-xs">
                  Material Name
                </Label>
                <Input
                  id={`name-${index}`}
                  type="text"
                  value={material.itemName}
                  onChange={(e) => updateMaterial(index, 'itemName', e.target.value)}
                  placeholder="e.g., Rough Logs"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`quantity-${index}`} className="text-xs">
                  Quantity
                </Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  min="1"
                  value={material.quantity}
                  onChange={(e) =>
                    updateMaterial(index, 'quantity', parseInt(e.target.value) || 0)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`price-${index}`} className="text-xs">
                  Price per Unit
                </Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  min="0"
                  value={material.pricePerUnit}
                  onChange={(e) =>
                    updateMaterial(index, 'pricePerUnit', parseFloat(e.target.value) || 0)
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border space-y-4">
        <h3 className="font-semibold">Additional Costs & Sale Info</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="crafting-fee" className="text-sm">
              Crafting Fee
            </Label>
            <Input
              id="crafting-fee"
              type="number"
              min="0"
              value={craftingFee}
              onChange={(e) => setCraftingFee(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="setup-fee" className="text-sm">
              Setup Fee
            </Label>
            <Input
              id="setup-fee"
              type="number"
              min="0"
              value={setupFee}
              onChange={(e) => setSetupFee(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sale-price" className="text-sm">
              Sale Price
            </Label>
            <Input
              id="sale-price"
              type="number"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="tax-rate" className="text-sm">
              Tax Rate (%)
            </Label>
            <Input
              id="tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
