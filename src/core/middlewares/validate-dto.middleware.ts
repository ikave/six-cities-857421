import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { MiddlewareInterface } from './middleware.interface.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import ValidationError from '../errors/validation-error.js';
import { transformErrors } from '../helpers/common.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}
  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(
        `Validation Error ${req.path}`,
        transformErrors(errors)
      );
    }

    next();
  }
}
