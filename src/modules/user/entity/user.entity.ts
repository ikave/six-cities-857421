import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { createSHA256 } from '../../../core/helpers/index.js';
import { User } from '../types/user.type.js';
import { UserType } from '../types/user-type.enum.js';

export interface UserEntity extends Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends TimeStamps implements User {
  @prop({
    type: String,
    minLength: 1,
    maxLength: 15,
    required: true,
    default: '',
  })
  public name: string;

  @prop({
    unique: true,
    required: true,
  })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar!: string;

  @prop({
    type: String,
    required: true,
    default: '',
  })
  private password?: string;

  @prop({
    enum: () => UserType,
    required: true,
  })
  public type: UserType;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
