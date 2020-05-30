export declare interface IProduct {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  salePrice: number;
  costPrice: number;
  inventory: IInvenoty;
  history: IHistory[];
}

declare interface IInvenoty {
  currentAmount: number;
  minAmount: number;
  maxAmount: number;
}

declare interface IHistory {
  date: Date;
  movementType: String;
}
