import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { FavoriteServiceInterface } from '../services/favorite-services.interface.js';
import { AppComponent } from 'src/types/app-component.enum.js';
import FavoriteServices from '../services/favorite.services.js';
import { FavoriteEntity, FavoriteModel } from '../entity/favorite.entity.js';

export function createFavoriteContainer() {
  const container = new Container();

  container
    .bind<FavoriteServiceInterface>(AppComponent.FavoriteServiceInterface)
    .to(FavoriteServices)
    .inSingletonScope();

  container
    .bind<ModelType<FavoriteEntity>>(AppComponent.FavoriteModel)
    .toConstantValue(FavoriteModel);

  return container;
}
