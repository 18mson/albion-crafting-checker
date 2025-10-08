import { Material, CraftingCalculation } from './types';

export function calculateProfit(
  materials: Material[],
  craftingFee: number,
  setupFee: number,
  itemSalePrice: number,
  taxRate: number
): CraftingCalculation {
  const totalMaterialCost = materials.reduce(
    (sum, material) => sum + material.quantity * material.pricePerUnit,
    0
  );

  const totalCost = totalMaterialCost + craftingFee + setupFee;
  const taxAmount = itemSalePrice * (taxRate / 100);
  const netRevenue = itemSalePrice - taxAmount;
  const netProfit = netRevenue - totalCost;
  const profitMargin = itemSalePrice > 0 ? (netProfit / itemSalePrice) * 100 : 0;

  return {
    materials,
    craftingFee,
    setupFee,
    itemSalePrice,
    taxRate,
    totalMaterialCost,
    totalCost,
    netProfit,
    profitMargin,
  };
}
