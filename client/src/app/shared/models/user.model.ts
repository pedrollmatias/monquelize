export interface IUser {
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  sex: string;
  bornDate: Date;
  blocked: boolean;
}
