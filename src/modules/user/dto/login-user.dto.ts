import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { USER_PASSWORD_LENGTH } from '../constants/user.constants.js';

export default class LoginUserDto {
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
}
