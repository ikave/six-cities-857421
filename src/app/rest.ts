import express, { Express } from 'express';
import cors from 'cors';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import { AppComponent } from '../types/app-component.enum.js';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import { getMongoURI } from '../core/helpers/db.js';
import { ControllerInterface } from '../core/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';
import { AuthMiddleware } from '../core/middlewares/auth.middleware.js';

@injectable()
export default class RestApplication {
  private app: Express;

  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface)
    private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface)
    private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.UserController)
    private readonly userController: ControllerInterface,
    @inject(AppComponent.OfferController)
    private readonly offerController: ControllerInterface,
    @inject(AppComponent.CommentController)
    private readonly commentController: ControllerInterface,
    @inject(AppComponent.FavoriteController)
    private readonly favoriteController: ControllerInterface,
    @inject(AppComponent.CityController)
    private readonly cityController: ControllerInterface,
    @inject(AppComponent.BaseExceptionFilter)
    private readonly baseExceptionFilter: ExceptionFilterInterface,
    @inject(AppComponent.ValidationExceptionFilter)
    private readonly httpExceptionFilter: ExceptionFilterInterface,
    @inject(AppComponent.HttpErrorExceptionFilter)
    private readonly validateExceptionFilter: ExceptionFilterInterface
  ) {
    this.app = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI({
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      databaseName: this.config.get('DB_NAME'),
    });

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    this.logger.info('Try to init server');
    const port = this.config.get('PORT');
    this.app.listen(port);
    this.logger.info(`Server started on http://localhost:${port}`);
  }

  private async _initRoutes() {
    this.logger.info('Controller initialization...');
    this.app.use('/users', this.userController.router);
    this.app.use('/offers', this.offerController.router);
    this.app.use('/comments', this.commentController.router);
    this.app.use('/favorites', this.favoriteController.router);
    this.app.use('/cities', this.cityController.router);
    this.logger.info('Controller initialization complete');
  }

  private async _initMiddleware() {
    this.logger.info('Global middleware initialization...');
    this.app.use(cors());
    this.app.use(express.json());

    const authMiddleware = new AuthMiddleware(this.config.get('JWT_SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));

    this.app.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.app.use(
      '/static',
      express.static(this.config.get('STATIC_DIRECTORY'))
    );
    this.logger.info('Global middleware initialization completed');
  }

  private async _initExceptionFilters() {
    this.logger.info('Exception filters initialization');
    this.app.use(
      this.validateExceptionFilter.catch.bind(this.validateExceptionFilter)
    );
    this.app.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.app.use(this.baseExceptionFilter.catch.bind(this.baseExceptionFilter));
    this.logger.info('Exception filters completed');
  }

  public async init() {
    this.logger.info('Application init...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this._initDb();
    await this._initMiddleware();
    await this._initRoutes();
    await this._initExceptionFilters();
    await this._initServer();
    this.logger.info('Init database completed');
  }
}
