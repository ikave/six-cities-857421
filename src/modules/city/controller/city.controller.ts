import { Request, Response } from 'express';
import { inject } from 'inversify';
import { ControllerAbstract } from '../../../core/controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { CityServiceInterface } from '../services/city-service.interface.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { fillDto } from '../../../core/helpers/common.js';
import cityWithIdRdo from '../rdo/city-with-id.rdo.js';

export default class CityController extends ControllerAbstract {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.CityServiceInterface)
    private readonly cityService: CityServiceInterface
  ) {
    super(logger);

    this.logger.info('Register city routes');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getCities,
    });
  }

  public async getCities(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();
    const citiesToResponce = fillDto(cityWithIdRdo, cities);

    this.ok(res, citiesToResponce);
  }
}
