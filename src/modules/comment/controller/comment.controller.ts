import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { ControllerAbstract } from '../../../core/controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { CommentServiceInterface } from '../services/comment-service.interface.js';
import CreateCommentDto from '../dto/create-comment.dto.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { fillDto } from '../../../core/helpers/common.js';
import CommentRdo from '../rdo/comment.rdo.js';
import { OfferServiceInterface } from '../../../modules/offer/services/offer-service.interface.js';
import HttpError from '../../../core/errors/http-error.js';
import { DocumentExistsMiddleware } from '../../../core/middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../../core/middlewares/validate-dto.middleware.js';
import { updateRating } from '../../../core/helpers/offers.js';
import { UnknownRecord } from '../../../types/unknown-record.js';
import { ValidateObjectIdMiddleware } from '../../../core/middlewares/validate-objectid.middleware.js';
import { PrivateRouteMiddleware } from '../../../core/middlewares/private-route.middleware.js';

@injectable()
export default class CommentController extends ControllerAbstract {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.addComment,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async addComment(
    {
      body,
      params,
    }: Request<ParamsDictionary, UnknownRecord, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const { id } = res.locals.user;

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'CommentService'
      );
    }

    const dto = {
      ...body,
      date: new Date(),
      offer: offerId,
      owner: id,
    };
    const comment = await this.commentService.create(dto, offerId);
    const updetedRating = updateRating(
      offer.raiting,
      offer.commentsCount,
      comment.rating
    );

    await this.offerService.updateById(
      {
        raiting: updetedRating,
      },
      offerId
    );

    const commentToResponse = fillDto(CommentRdo, comment);
    this.created(res, commentToResponse);
  }

  public async getComments(
    { params }: Request<ParamsDictionary, UnknownRecord, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'CommentService'
      );
    }

    const comments = await this.commentService.findByOfferId(offerId);

    const commentsToResponse = fillDto(CommentRdo, comments);

    this.ok(res, commentsToResponse);
  }
}
