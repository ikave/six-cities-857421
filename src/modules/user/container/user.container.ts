import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import UserService from '../services/user.service.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { UserServiceInterface } from '../services/user-service.interface.js';
import { UserEntity, UserModel } from '../entity/user.entity.js';

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
