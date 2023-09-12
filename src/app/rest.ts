import express, { Express } from 'express';
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
    @inject(AppComponent.ExceptionFilterInterface)
    private readonly exceptionFilter: ExceptionFilterInterface
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
    this.logger.info('Controller initialization complete');
  }

  private async _initMiddleware() {
    this.logger.info('Global middleware initialization...');
    this.app.use(express.json());

    const authMiddleware = new AuthMiddleware(this.config.get('JWT_SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
    this.logger.info('Global middleware initialization completed');
  }

  private async _initExceptionFilters() {
    this.logger.info('Exception filters initialization');
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
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
