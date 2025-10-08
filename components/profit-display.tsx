'use client';

import { CraftingCalculation } from '@/lib/types';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfitDisplayProps {
  calculation: CraftingCalculation;
}

export function ProfitDisplay({ calculation }: ProfitDisplayProps) {
  const isProfit = calculation.netProfit > 0;
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-4 sticky top-4">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Net Profit</h2>
          {isProfit ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
        </div>
        <div className={cn(
          "text-3xl font-bold mb-1",
          isProfit ? "text-green-500" : "text-destructive"
        )}>
          {isProfit ? '+' : ''}{formatCurrency(calculation.netProfit)}
        </div>
        <div className="text-sm text-muted-foreground">
          {calculation.profitMargin.toFixed(2)}% margin
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Cost Breakdown
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Materials</span>
            <span className="font-medium">{formatCurrency(calculation.totalMaterialCost)}</span>
          </div>

          {calculation.materials.map((material, index) => (
            material.itemName && (
              <div key={index} className="flex justify-between items-center text-sm pl-4">
                <span className="text-muted-foreground">
                  {material.itemName} x{material.quantity}
                </span>
                <span>{formatCurrency(material.quantity * material.pricePerUnit)}</span>
              </div>
            )
          ))}

          {calculation.craftingFee > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Crafting Fee</span>
              <span>{formatCurrency(calculation.craftingFee)}</span>
            </div>
          )}

          {calculation.setupFee > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Setup Fee</span>
              <span>{formatCurrency(calculation.setupFee)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-border font-semibold">
            <span>Total Cost</span>
            <span>{formatCurrency(calculation.totalCost)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Revenue</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sale Price</span>
            <span className="font-medium">{formatCurrency(calculation.itemSalePrice)}</span>
          </div>

          {calculation.taxRate > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Tax ({calculation.taxRate}%)
              </span>
              <span className="text-destructive">
                -{formatCurrency(calculation.itemSalePrice * (calculation.taxRate / 100))}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-border font-semibold">
            <span>Net Revenue</span>
            <span>
              {formatCurrency(
                calculation.itemSalePrice -
                calculation.itemSalePrice * (calculation.taxRate / 100)
              )}
            </span>
          </div>
        </div>
      </Card>

      {calculation.netProfit !== 0 && (
        <Card className={cn(
          "p-4",
          isProfit
            ? "bg-green-500/10 border-green-500/30"
            : "bg-destructive/10 border-destructive/30"
        )}>
          <p className="text-sm text-center font-medium">
            {isProfit
              ? "This craft will be profitable!"
              : "This craft will result in a loss."}
          </p>
        </Card>
      )}
    </div>
  );
}
