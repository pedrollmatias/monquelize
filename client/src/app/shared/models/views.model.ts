import { IAssociatedIds } from './associated-ids.model';

export declare interface IProduct {
  _id?: string;
  associatedIds?: IAssociatedIds;
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

export interface ICategory {
  _id?: string;
  associatedIds?: IAssociatedIds;
  name: string;
  parent?: any;
  path: string;
  products?: any[];
}

export interface IPaymentMethod {
  _id?: string;
  associatedIds?: IAssociatedIds;
  name: string;
  acceptChange: boolean;
}

export interface IUser {
  _id?: string;
  associatedIds?: IAssociatedIds;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  sex: string;
  bornDate: Date;
  blocked: boolean;
}

export interface IUnit {
  _id?: string;
  associatedIds?: IAssociatedIds;
  unit: string;
  shortUnit: string;
  decimalPlaces?: number;
}

export interface IOperationProduct {
  _id?: string;
  associatedIds?: IAssociatedIds;
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
