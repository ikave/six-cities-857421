import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParamsDictionary } from 'express-serve-static-core';
import { ControllerAbstract } from '../../../core/controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { OfferServiceInterface } from '../services/offer-service.interface.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import CreateOfferDto from '../dto/create-offer.dto.js';
import { fillDto } from '../../../core/helpers/common.js';
import OfferRdo from '../rdo/offer.rdo.js';
import OfferDetailRdo from '../rdo/offer-detail.rdo.js';
import { CommentServiceInterface } from '../../../modules/comment/services/comment-service.interface.js';
import { PrivateRouteMiddleware } from '../../../core/middlewares/private-route.middleware.js';
import { ValidateObjectIdMiddleware } from '../../../core/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../../core/middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../../core/middlewares/validate-dto.middleware.js';
import UpdateOfferDto from '../dto/update-offer.dto.js';
import { DocumentCanEditedMiddleware } from '../../../core/middlewares/document-can-edited.middleware.js';

type OffersParams =
  | {
      cityId: string;
      offerId: string;
    }
  | ParamsDictionary;

@injectable()
export default class OfferController extends ControllerAbstract {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface
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
      ],
    });
  }

  public async getOffers(req: Request, res: Response): Promise<void> {
    const { city } = req.query;
    const offers = await this.offerService.find(city as string);
    const offersToResponse = fillDto(OfferRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async getPremiumOffers(req: Request, res: Response): Promise<void> {
    const { city } = req.query;
    const offers = await this.offerService.findPremium(city as string);
    const offersToResponse = fillDto(OfferRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async createOffer(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateOfferDto
    >,
    res: Response
  ): Promise<void> {
    const user = res.locals.user;
    const offer = await this.offerService.create({
      ...body,
      owner: user.id,
    });
    const offerToResponse = fillDto(OfferRdo, offer);
    this.created(res, offerToResponse);
  }

  public async getOffer(
    { params }: Request<OffersParams, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    const offerToResponse = fillDto(OfferDetailRdo, offer);
    this.ok(res, offerToResponse);
  }

  public async updateOffer(
    {
      params,
      body,
    }: Request<OffersParams, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.updateById(body, offerId);
    const offerToResponse = fillDto(OfferRdo, offer);
    this.ok(res, offerToResponse);
  }

  public async deleteOffer(
    { params }: Request<OffersParams, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOffer(offerId);

    this.noContent(res, offer);
  }
}
