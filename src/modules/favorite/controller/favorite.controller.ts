import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ControllerAbstract } from '../../../core/controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { FavoriteServiceInterface } from '../services/favorite-services.interface.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { fillDto } from '../../../core/helpers/common.js';
import OfferRdo from '../../../modules/offer/rdo/offer.rdo.js';

type RequestParams =
  | {
      userId: string;
      offerId: string;
    }
  | ParamsDictionary;

@injectable()
export default class FavoriteController extends ControllerAbstract {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.FavoriteServiceInterface)
    private readonly favoriteServices: FavoriteServiceInterface
  ) {
    super(logger);

    this.logger.info('Register favorite routes');

    this.addRoute({
      path: '/:userId',
      method: HttpMethod.Get,
      handler: this.getFavorites,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.add,
    });

    this.addRoute({
      path: '/:offerId/:userId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });
  }

  public async add({ body }: Request, res: Response): Promise<void> {
    const favorite = await this.favoriteServices.add(body.offer, body.user);
    const favoriteToResponse = {
      ...fillDto(OfferRdo, favorite.offer),
      isFavorite: true,
    };
    this.created(res, favoriteToResponse);
  }

  public async delete(
    { params }: Request<RequestParams>,
    res: Response
  ): Promise<void> {
    const { offerId, userId } = params;
    const offer = await this.favoriteServices.delete(offerId, userId);
    const favoriteToResponse = {
      ...fillDto(OfferRdo, offer),
      isFavorite: false,
    };
    this.ok(res, favoriteToResponse);
  }

  public async getFavorites(
    { params }: Request<RequestParams>,
    res: Response
  ): Promise<void> {
    const { userId } = params;
    const favorites = await this.favoriteServices.find(userId);
    const favoritesToResponse = favorites.map((item) => ({
      ...fillDto(OfferRdo, item.offer),
      isFavorite: true,
    }));
    this.ok(res, favoritesToResponse);
  }
}
