import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ControllerAbstract } from '../../../core/controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { FavoriteServiceInterface } from '../services/favorite-service.interface.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { fillDto } from '../../../core/helpers/common.js';
import { ValidateObjectIdMiddleware } from '../../../core/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../../core/middlewares/document-exists.middleware.js';
import { OfferServiceInterface } from '../../../modules/offer/services/offer-service.interface.js';
import OfferRdo from '../../offer/rdo/offer.rdo.js';
import { PrivateRouteMiddleware } from '../../../core/middlewares/private-route.middleware.js';

@injectable()
export default class FavoriteController extends ControllerAbstract {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.FavoriteServiceInterface)
    private readonly favoriteServices: FavoriteServiceInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface
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
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async addToFavorites(
    { params: { offerId } }: Request<ParamsDictionary>,
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
    { params }: Request<ParamsDictionary>,
    res: Response
  ): Promise<void> {
    const userId = res.locals.user.id;
    const { offerId } = params;
    const favorite = await this.favoriteServices.removeFromFavorites(
      offerId,
      userId
    );

    if (favorite) {
      const favoriteToResponse = {
        ...fillDto(OfferRdo, favorite.offer),
        isFavorite: false,
      };
      this.ok(res, favoriteToResponse);
    }
  }

  public async getFavorites(
    _req: Request<ParamsDictionary>,
    res: Response
  ): Promise<void> {
    const user = res.locals.user.id;
    const favorites = await this.favoriteServices.findFavorites(user);
    const favoritesToResponse = favorites.map((favorite) => ({
      ...fillDto(OfferRdo, favorite.offer),
      isFavorite: true,
    }));
    this.ok(res, favoritesToResponse);
  }
}
