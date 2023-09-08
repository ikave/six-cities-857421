import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import UserService from '../services/user.service.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { UserServiceInterface } from '../services/user-service.interface.js';
import { UserEntity, UserModel } from '../entity/user.entity.js';
import { ControllerInterface } from 'src/core/controller/controller.interface.js';
import UserController from '../controller/user.controller.js';

export const createUserContainer = () => {
  const container = new Container();

  container
    .bind<UserServiceInterface>(AppComponent.UserServiceInterface)
    .to(UserService)
    .inSingletonScope();

  container
    .bind<types.ModelType<UserEntity>>(AppComponent.UserModel)
    .toConstantValue(UserModel);

  container
    .bind<ControllerInterface>(AppComponent.UserController)
    .to(UserController)
    .inSingletonScope();

  return container;
};
