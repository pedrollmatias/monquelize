import { ICategory } from './category.model';
import { IUnit } from './unit.model';

export declare interface IProduct {
  sku: string;
  name: string;
  description?: string;
  category?: ICategory | string;
  unit: IUnit | string;
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

export declare interface IHistory {
  date: Date;
  movementType: String;
  amount: number;
}
