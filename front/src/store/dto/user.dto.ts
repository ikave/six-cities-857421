import { UserType } from '../../const';

export class UserDto {
  public name!: string;
  public email!: string;
  public avatar!: string;
  public type!: UserType;
}
