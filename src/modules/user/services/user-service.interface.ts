import { DocumentType } from '@typegoose/typegoose';
import CreateUserDto from '../dto/create-user.dto.js';
import { UserEntity } from '../entity/user.entity.js';
import UpdateUserDto from '../dto/update-user.dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>>;
  update(
    id: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null>;
}
