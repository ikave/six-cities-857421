import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { Container } from 'inversify';
import { CityServiceInterface } from '../services/city-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { CityService } from '../services/city.service.js';
import { CityEntity, CityModel } from '../entity/city.entity.js';
import { ControllerInterface } from '../../../core/controller/controller.interface.js';
import CityController from '../controller/city.controller.js';

export function createCityContainer() {
  const container = new Container();

  container
    .bind<CityServiceInterface>(AppComponent.CityServiceInterface)
    .to(CityService)
    .inSingletonScope();

  container
    .bind<ModelType<CityEntity>>(AppComponent.CityModel)
    .toConstantValue(CityModel);

  container
    .bind<ControllerInterface>(AppComponent.CityController)
    .to(CityController)
    .inSingletonScope();

  return container;
}
