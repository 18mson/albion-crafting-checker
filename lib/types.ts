export interface AlbionItem {
  UniqueName: string;
  LocalizedNames: {
    "EN-US": string;
  };
  Index: string;
}

export interface Material {
  itemName: string;
  quantity: number;
  pricePerUnit: number;
}

export interface CraftingCalculation {
  materials: Material[];
  craftingFee: number;
  setupFee: number;
  itemSalePrice: number;
  taxRate: number;
  totalMaterialCost: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;
}
