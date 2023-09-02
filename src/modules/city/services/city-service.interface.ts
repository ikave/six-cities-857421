import { DocumentType } from '@typegoose/typegoose';
import { CityEntity } from '../entity/city.entity.js';
import CreateCityDto from '../dto/create-city.dto.js';

export interface CityServiceInterface {
  findById(cityId: string): Promise<DocumentType<CityEntity> | null>;
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  find(): Promise<DocumentType<CityEntity>[]>;
  findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
}
