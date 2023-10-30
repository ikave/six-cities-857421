import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { createSecretKey } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../errors/http-error.js';
import { MiddlewareInterface } from './middleware.interface.js';

export class AuthMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );

      const { id } = payload as { id: string };

      res.locals.user = { id };

      return next();
    } catch (error) {
      return next(
        new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Invalid token',
          'AuthMiddleware'
        )
      );
    }
  }
}
