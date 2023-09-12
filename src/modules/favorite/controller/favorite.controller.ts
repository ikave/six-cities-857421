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
import { PrivateRouteMiddleware } from '../../../core/middlewares/private-route.middleware.js';
import { ValidateObjectIdMiddleware } from '../../../core/middlewares/validate-objectid.middleware.js';

type RequestParams =
  | {
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
      path: '/',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.addToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
      ],
    });
  }

  public async addToFavorites(
    { params: { offerId } }: Request<RequestParams>,
    res: Response
  ): Promise<void> {
    const userId = res.locals.user.id;
    const favorite = await this.favoriteServices.addToFavorites(
      offerId,
      userId
    );
    const favoriteToResponse = {
      ...fillDto(OfferRdo, favorite.offer),
      isFavorite: true,
    };
    this.created(res, favoriteToResponse);
  }

  public async removeFromFavorites(
    { params }: Request<RequestParams>,
    res: Response
  ): Promise<void> {
    const user = res.locals.user.id;
    const { offerId } = params;
    const favorite = await this.favoriteServices.removeFromFavorites(
      offerId,
      user
    );

    const favoriteToResponse = {
      ...fillDto(OfferRdo, favorite),
      isFavorite: false,
    };
    this.ok(res, favoriteToResponse);
  }

  public async getFavorites(
    _req: Request<RequestParams>,
    res: Response
  ): Promise<void> {
    const user = res.locals.user.id;
    const favorites = await this.favoriteServices.findFavorites(user);
    const favoritesToResponse = favorites.map((item) => ({
      ...fillDto(OfferRdo, item.offer),
      isFavorite: true,
    }));
    this.ok(res, favoritesToResponse);
  }
}
