export interface ICategory {
  _id?: string;
  name: string;
  parent?: any;
  path: string;
  products?: any[];
}
