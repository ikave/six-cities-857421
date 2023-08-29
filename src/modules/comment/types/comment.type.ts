import { User } from '../../user/types/user.type.js';

export type Comment = {
  text: string;
  rating: number;
  owner: User;
  offerId: string;
};
