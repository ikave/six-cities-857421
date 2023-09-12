import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { DocumentCanEditedInterface } from '../../modules/offer/types/document-can-edited.interface.js';

export class DocumentCanEditedMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentCanEditedInterface,
    private readonly entityName: string,
    private readonly paramName: string
  ) {}

  public async execute(
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const offerId = params[this.paramName];
    const userId = res.locals.user.id;

    if (!(await this.service.checkOwner(offerId, userId))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `You cannot edit this ${this.entityName}!`,
        'DocumentCanEditedMiddleware'
      );
    }

    next();
  }
}
