import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { ControllerAbstract } from '../../../core/controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { OfferServiceInterface } from '../services/offer-service.interface.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import CreateOfferDto from '../dto/create-offer.dto.js';
import { fillDto } from '../../../core/helpers/common.js';
import OfferRdo from '../rdo/offer.rdo.js';
import { CommentServiceInterface } from '../../../modules/comment/services/comment-service.interface.js';
import { PrivateRouteMiddleware } from '../../../core/middlewares/private-route.middleware.js';
import { ValidateObjectIdMiddleware } from '../../../core/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../../core/middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../../core/middlewares/validate-dto.middleware.js';
import UpdateOfferDto from '../dto/update-offer.dto.js';
import { DocumentCanEditedMiddleware } from '../../../core/middlewares/document-can-edited.middleware.js';
import { CityService } from '../../../modules/city/services/city.service.js';
import FavoriteServices from '../../favorite/services/favorite.service.js';
import { UnknownRecord } from '../../../types/unknown-record.js';
import HttpError from '../../../core/errors/http-error.js';

@injectable()
export default class OfferController extends ControllerAbstract {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.CityServiceInterface)
    private readonly cityService: CityService,
    @inject(AppComponent.FavoriteServiceInterface)
    private readonly favoriteService: FavoriteServices
  ) {
    super(logger);

    this.logger.info('Register offer routes');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new DocumentCanEditedMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new DocumentCanEditedMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async getOffers({ query }: Request, res: Response): Promise<void> {
    const user = res.locals.user;
    const { cityName } = query;

    const city = await this.cityService.findByName(cityName as string);

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Unknown city',
        'OfferController'
      );
    }

    const offers = await this.offerService.find(city.id);

    if (user) {
      for (const offer of offers) {
        offer.isFavorite = await this.favoriteService.checkIsFavorite(
          offer.id,
          user.id
        );
      }
    }

    const offersToResponse = fillDto(OfferRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async getPremiumOffers(
    { query }: Request,
    res: Response
  ): Promise<void> {
    const { cityName } = query;
    const city = await this.cityService.findByName(cityName as string);

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Unknown city',
        'OfferController'
      );
    }

    const offers = await this.offerService.findPremium(city.id);
    const offersToResponse = fillDto(OfferRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async createOffer(
    { body }: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const user = res.locals.user;

    const city = await this.cityService.findByName(body.city.name);

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Unknown city',
        'OfferController'
      );
    }

    if (city) {
      const offer = await this.offerService.create({
        ...body,
        owner: user.id,
        city: city.id,
      });
      const offerToResponse = fillDto(OfferRdo, offer);
      this.created(res, offerToResponse);
    }
  }

  public async getOffer({ params }: Request, res: Response): Promise<void> {
    const { offerId } = params;
    const userId = res.locals.user ? res.locals.user.id : '';
    const offer = await this.offerService.findById(offerId, userId);
    const offerToResponse = fillDto(OfferRdo, offer);
    this.ok(res, offerToResponse);
  }

  public async updateOffer(
    { params, body }: Request<ParamsDictionary, UnknownRecord, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = res.locals.user.id;
    const city = await this.cityService.findByName(body.city.name);

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Unknown city',
        'OfferController'
      );
    }

    const isFavorite = await this.favoriteService.checkIsFavorite(
      offerId,
      userId
    );
    const updatedOffer = await this.offerService.updateById(
      { ...body, city: city.id },
      offerId
    );

    if (updatedOffer) {
      updatedOffer.isFavorite = isFavorite;
    }

    const offerToResponse = fillDto(OfferRdo, updatedOffer);
    this.ok(res, offerToResponse);
  }

  public async deleteOffer({ params }: Request, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);
    await this.favoriteService.deleteByOffer(offerId);
    await this.commentService.deleteByOffer(offerId);

    const offerToResponse = fillDto(OfferRdo, offer);
    this.ok(res, offerToResponse);
  }
}
