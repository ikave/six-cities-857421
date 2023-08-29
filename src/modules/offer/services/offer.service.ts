import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateOfferDto from '../dto/create-offer.dto.js';
import { OfferEntity } from '../entity/offer.entity.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import UpdateOfferDto from '../dto/update-offer.dto.js';
import { OFFER_COUNT_MAX, PREMIUM_OFFER_COUNT } from '../constants.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async incComentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(offerId, {
      $inc: { commentsCount: 1 },
    });
  }

  public async updateById(
    dto: UpdateOfferDto,
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndUpdate(offerId, dto)
      .populate(['owner'])
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .find()
      .limit(OFFER_COUNT_MAX)
      .populate(['owner'])
      .exec();
  }

  public async findPremium(
    isPremium: boolean
  ): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .find({ isPremium })
      .limit(PREMIUM_OFFER_COUNT)
      .populate(['owner'])
      .exec();
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findById(offerId).populate(['owner']).exec();
  }
}
