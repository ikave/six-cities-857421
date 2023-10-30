import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateUserDto from '../dto/create-user.dto.js';
import { UserEntity } from '../entity/user.entity.js';
import { UserServiceInterface } from './user-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import UpdateUserDto from '../dto/update-user.dto.js';
import LoginUserDto from '../dto/login-user.dto.js';
import ConfigService from '../../../core/config/config.service.js';
import { AVATAR_DEFAULT } from '../constants/user.constants.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
    @inject(AppComponent.ConfigInterface)
    private readonly configService: ConfigService
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    user.avatar = `${this.configService.getPath()}/${this.configService.get(
      'STATIC_DIRECTORY'
    )}/${AVATAR_DEFAULT}`;
    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById({ _id: id });
  }

  public async findByEmail(
    email: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existUser = await this.findByEmail(dto.email);

    return existUser ? existUser : this.create(dto, salt);
  }

  public async update(
    id: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          avatar: `${this.configService.getPath()}/${this.configService.get(
            'UPLOAD_DIRECTORY'
          )}/${dto.avatar}`,
        },
        { new: true }
      )
      .exec();
  }

  public async verifyUser(
    dto: LoginUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.userModel.findById({ _id: id })) !== null;
  }
}
