import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { UserServiceInterface } from '../../modules/user/services/user-service.interface.js';

export class UserExistsMiddleware implements MiddlewareInterface {
  constructor(private readonly service: UserServiceInterface) {}

  public async execute(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = res.locals.user;
    if (user) {
      if (!(await this.service.exists(user.id))) {
        throw new HttpError(
          StatusCodes.NOT_FOUND,
          `User with ${user.id} not found`,
          'DocumentExistsMiddleware'
        );
      }
    }

    next();
  }
}
