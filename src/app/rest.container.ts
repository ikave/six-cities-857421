import { Container } from 'inversify';
import { AppComponent } from '../types/app-component.enum.js';
import RestApplication from './rest.js';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import PinoService from '../core/logger/pino.service.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import ConfigService from '../core/config/config.service.js';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import MongoClientService from '../core/database-client/mongo-client.service.js';
import { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';
import BaseExceptionFilter from '../core/exception-filters/base.exception-filter.js';
import ValidateExceptionFilter from '../core/exception-filters/validate.exception-filter.js';
import HttpExceptionFilter from '../core/exception-filters/http.exception-filter.js';

export const createRestAppContainer = () => {
  const container = new Container();

  container
    .bind<RestApplication>(AppComponent.RestApplication)
    .to(RestApplication)
    .inSingletonScope();

  container
    .bind<LoggerInterface>(AppComponent.LoggerInterface)
    .to(PinoService)
    .inSingletonScope();

  container
    .bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface)
    .to(ConfigService)
    .inSingletonScope();

  container
    .bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface)
    .to(MongoClientService)
    .inSingletonScope();

  container
    .bind<ExceptionFilterInterface>(AppComponent.BaseExceptionFilter)
    .to(BaseExceptionFilter)
    .inSingletonScope();

  container
    .bind<ExceptionFilterInterface>(AppComponent.HttpErrorExceptionFilter)
    .to(ValidateExceptionFilter)
    .inSingletonScope();

  container
    .bind<ExceptionFilterInterface>(AppComponent.ValidationExceptionFilter)
    .to(HttpExceptionFilter)
    .inSingletonScope();

  return container;
};
