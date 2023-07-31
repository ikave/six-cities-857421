import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { User } from './types/user.type.js';
import { createSHA256 } from '../../core/helpers/common.js';
import { UserType } from './types/user-type.enum.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    type: String,
    minLength: 1,
    maxLength: 15,
    required: true,
    default: '',
  })
  public name: string;

  @prop({
    type: String,
    unique: true,
    required: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar: string;

  @prop({
    type: String,
    required: true,
    minlength: 6,
    maxLength: 12,
    default: '',
  })
  private password?: string;

  @prop({
    type: String,
    required: true,
    default: '',
  })
  public type: UserType;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
