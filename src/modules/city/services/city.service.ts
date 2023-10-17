import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CityServiceInterface } from './city-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { CityEntity } from '../entity/city.entity.js';
import CreateCityDto from '../dto/create-city.dto.js';

@injectable()
export class CityService implements CityServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.CityModel)
    private readonly cityModel: types.ModelType<CityEntity>
  ) {}

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const result = await this.cityModel.create(dto);
    this.logger.info(`New city created: ${dto.name}`);
    return result;
  }

  public async findById(
    cityId: string
  ): Promise<DocumentType<CityEntity> | null> {
    return await this.cityModel.findById(cityId).exec();
  }

  public async findByName(
    cityName: string
  ): Promise<DocumentType<CityEntity> | null> {
    return await this.cityModel.findOne({ name: cityName }).exec();
  }

  public async find(): Promise<DocumentType<CityEntity>[]> {
    return await this.cityModel.find().exec();
  }

  public async findOrCreate(
    dto: CreateCityDto
  ): Promise<DocumentType<CityEntity>> {
    const existCity = await this.cityModel.findOne({ name: dto.name });

    return existCity ? existCity : this.create(dto);
  }
}
