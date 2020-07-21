export interface IUser {
  _id?: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  sex: string;
  bornDate: Date;
  blocked: boolean;
}
