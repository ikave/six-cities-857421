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

type CommentParams =
  | {
      offerId: string;
    }
  | ParamsDictionary;

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
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
    });
  }

  public async addComment(
    {
      body,
      params,
    }: Request<CommentParams, Record<string, unknown>, CreateCommentDto>,
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

    const dto = {
      ...body,
      date: new Date(),
      offer: offerId,
    };
    const comment = await this.commentService.create(dto, offerId);

    const commentToResponse = fillDto(CommentRdo, comment);
    this.created(res, commentToResponse);
  }

  public async getComments(
    {
      params,
    }: Request<CommentParams, Record<string, unknown>, CreateCommentDto>,
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
