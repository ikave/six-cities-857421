import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { createErrorObject } from '../helpers/common.js';
import { ServiceError } from '../../types/service-error.enum.js';
import ValidationError from '../errors/validation-error.js';

@injectable()
export default class ValidateExceptionFilter
implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register ValidateExceptionFilter');
  }

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`);

    error.details.forEach((errorField) =>
      this.logger.error(`[${errorField.property}]: - ${errorField.messages}`)
    );

    res
      .status(error.httpStatusCode)
      .json(
        createErrorObject(
          ServiceError.ValidationError,
          error.message,
          error.details
        )
      );
  }
}
