import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateUserDto from '../dto/create-user.dto.js';
import { UserEntity } from '../entity/user.entity.js';
import { UserServiceInterface } from './user-service.interface.js';
import { AppComponent } from '~/types/app-component.enum.js';
import { LoggerInterface } from '~/core/logger/logger.interface.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById({ id });
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
}
