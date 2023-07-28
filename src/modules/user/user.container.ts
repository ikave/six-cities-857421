import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponent } from '../../types/app-component.enum.js';
import UserService from './services/user.service.js';
import { UserServiceInterface } from './services/user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';

export const createUserContainer = () => {
  const container = new Container();

  container
    .bind<UserServiceInterface>(AppComponent.UserServiceInterface)
    .to(UserService)
    .inSingletonScope();

  container
    .bind<types.ModelType<UserEntity>>(AppComponent.UserModel)
    .toConstantValue(UserModel);

  return container;
};
