export declare interface IOperationProduct {
  _id?: string;
  productRef?: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit: IUnit | string;
  salePrice: number;
  amount: number;
  subtotal?: number;
}

declare interface IUnit {
  unitRef?: string;
  shortUnit: string;
}
