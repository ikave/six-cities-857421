import { Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { ControllerInterface } from './controller.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { RouteInterface } from '../../types/route.interface.js';

@injectable()
export class ControllerAbstract implements ControllerInterface {
  private readonly _router: Router;
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    this._router[route.method](
      route.path,
      asyncHandler(route.handler.bind(this))
    );
    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  public send<T>(res: Response, statusCode: number, data: T) {
    res.type('application/json').status(statusCode).json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }
}
