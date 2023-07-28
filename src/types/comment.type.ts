import { User } from '../modules/user/types/user.type.js';

export type Comment = {
  text: string;
  date: Date;
  rating: number;
  owner: User;
};
