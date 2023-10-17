import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { ControllerAbstract } from '../../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { UserServiceInterface } from '../services/user-service.interface.js';
import { createJWT, fillDto } from '../../../core/helpers/common.js';
import UserRdo from '../rdo/user.rdo.js';
import HttpError from '../../../core/errors/http-error.js';
import CreateUserDto from '../dto/create-user.dto.js';
import ConfigService from '../../../core/config/config.service.js';
import LoginUserDto from '../dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../../core/middlewares/validate-dto.middleware.js';
import { JWT_ALGORITHM } from '../constants/user.constants.js';
import { ValidateObjectIdMiddleware } from '../../../core/middlewares/validate-objectid.middleware.js';
import { UserExistsMiddleware } from '../../../core/middlewares/user-exists.middleware.js';
import { UploadFileMiddleware } from '../../../core/middlewares/upload-file.middleware.js';
// import { PrivateRouteMiddleware } from '../../../core/middlewares/private-route.middleware.js';

type ParamsUserDetail =
  | {
      id: string;
    }
  | ParamsDictionary;

@injectable()
export default class UserController extends ControllerAbstract {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface)
    private readonly configService: ConfigService
  ) {
    super(logger);

    this.logger.info('Register user routes');

    this.addRoute({
      path: '/profile/:id',
      method: HttpMethod.Get,
      handler: this.getProfile,
      middlewares: [new ValidateObjectIdMiddleware('id')],
    });
    this.addRoute({
      path: '/profile/:id',
      method: HttpMethod.Patch,
      handler: this.updateProfile,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        // new PrivateRouteMiddleware(),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
      ],
    });
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [new UserExistsMiddleware(this.userService)],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });
  }

  public async getProfile(
    { params }: Request<ParamsUserDetail>,
    res: Response
  ): Promise<void> {
    const { id } = params;
    const user = await this.userService.findById(id);
    const userToResponse = fillDto(UserRdo, user);
    this.ok(res, userToResponse);
  }

  public async register(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateUserDto
    >,
    res: Response
  ): Promise<void> {
    const { body } = req;
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with ${body.email} is exist`,
        'UserController'
      );
    }

    const newUser = await this.userService.create(
      body,
      this.configService.get('SALT')
    );
    this.created(res, fillDto(UserRdo, newUser));
  }

  public async login(
    {
      body,
    }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(
      body,
      this.configService.get('SALT')
    );

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      { id: user.id }
    );

    this.ok(res, {
      ...fillDto(UserRdo, user),
      token,
    });
  }

  public logout(_req: Request, res: Response): void {
    this.noContent(res, 'Logout is success');
  }

  public async updateProfile(
    { params, file }: Request,
    res: Response
  ): Promise<void> {
    const userId = params.id;

    if (file) {
      const filePath = file.filename;
      const updated = await this.userService.update(userId, {
        avatar: filePath,
      });
      this.ok(res, fillDto(UserRdo, updated));
    }
  }

  public async checkAuth(_req: Request, res: Response): Promise<void> {
    if (!res.locals.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const { id } = res.locals.user;

    const foundedUser = await this.userService.findById(id);

    this.ok(res, fillDto(UserRdo, foundedUser));
  }
}
