import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponent } from '../../../types/app-component.enum.js';
import { OfferServiceInterface } from '../services/offer-service.interface.js';
import OfferService from '../services/offer.service.js';
import { OfferEntity, OfferModel } from '../entity/offer.entity.js';
import { ControllerInterface } from '../../../core/controller/controller.interface.js';
import OfferController from '../controller/offer.controller.js';

export function createOfferContainer() {
  const container = new Container();

  container
    .bind<OfferServiceInterface>(AppComponent.OfferServiceInterface)
    .to(OfferService)
    .inSingletonScope();

  container
    .bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel)
    .toConstantValue(OfferModel);

  container
    .bind<ControllerInterface>(AppComponent.OfferController)
    .to(OfferController)
    .inSingletonScope();

  return container;
}
