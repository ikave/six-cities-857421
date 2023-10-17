import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { FavoriteServiceInterface } from '../services/favorite-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import FavoriteServices from '../services/favorite.service.js';
import { FavoriteEntity, FavoriteModel } from '../entity/favorite.entity.js';
import { ControllerInterface } from '../../../core/controller/controller.interface.js';
import FavoriteController from '../controller/favorite.controller.js';

export function createFavoriteContainer() {
  const container = new Container();

  container
    .bind<FavoriteServiceInterface>(AppComponent.FavoriteServiceInterface)
    .to(FavoriteServices)
    .inSingletonScope();

  container
    .bind<ModelType<FavoriteEntity>>(AppComponent.FavoriteModel)
    .toConstantValue(FavoriteModel);

  container
    .bind<ControllerInterface>(AppComponent.FavoriteController)
    .to(FavoriteController)
    .inSingletonScope();

  return container;
}
