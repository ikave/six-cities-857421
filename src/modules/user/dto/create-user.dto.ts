import {
  USER_NAME_LENGTH,
  USER_PASSWORD_LENGTH,
} from '../constants/user.constants.js';
import { UserType } from '../types/user-type.enum.js';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class CreateUserDto {
  @IsString({ message: 'Name is required' })
  @MinLength(USER_NAME_LENGTH.Min, {
    message: `Min length for user name is ${USER_NAME_LENGTH.Min} char`,
  })
  @MaxLength(USER_NAME_LENGTH.Max, {
    message: `Max length for user name is ${USER_NAME_LENGTH.Max} chars`,
  })
  public name!: string;

  @IsEmail({}, { message: 'Email must be valid!' })
  public email!: string;

  @IsString({ message: 'Password is required' })
  @MinLength(USER_PASSWORD_LENGTH.Min, {
    message: `Min length for user password is ${USER_PASSWORD_LENGTH.Min}`,
  })
  @MaxLength(USER_PASSWORD_LENGTH.Max, {
    message: `Max length for user password is ${USER_PASSWORD_LENGTH.Max}`,
  })
  public password!: string;

  @IsEnum(UserType, {
    message: `User type must be is ${UserType.Pro} or ${UserType.Regular}`,
  })
  public type!: UserType;
}
