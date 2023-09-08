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
import HttpError from '../../../core/errors/http-error.js';
import { fillDto } from '../../../core/helpers/common.js';
import OfferRdo from '../rdo/offer.rdo.js';
import OfferDetailRdo from '../rdo/offer-detail.rdo.js';
import { CommentServiceInterface } from '../../../modules/comment/services/comment-service.interface.js';

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
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateOffer,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
    });
  }

  public async getOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
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
    const offer = await this.offerService.create(body);
    const offerToResponse = fillDto(OfferRdo, offer);
    this.created(res, offerToResponse);
  }

  public async getOffer(
    { params }: Request<OffersParams, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController'
      );
    }

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

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController'
      );
    }

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

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController'
      );
    }

    this.ok(res, 'Offer has been deleted');
  }
}
