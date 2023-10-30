import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import CreateOfferDto from '../dto/create-offer.dto.js';
import { OfferEntity } from '../entity/offer.entity.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import UpdateOfferDto from '../dto/update-offer.dto.js';
import { Offer } from '../constants/offer.constants.js';
import { SortType } from '../../../types/sort-type.enum.js';
import FavoriteServices from '../../favorite/services/favorite.service.js';
import UpdateRatingDto from '../dto/update-rating.dto.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(AppComponent.FavoriteServiceInterface)
    private readonly favoriteService: FavoriteServices
  ) {}

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(
      offerId,
      {
        $inc: { commentsCount: 1 },
      },
      { new: true }
    );
  }

  public async updateById(
    dto: UpdateOfferDto,
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['owner', 'city'])
      .exec();
  }

  public async updateRating(
    rating: UpdateRatingDto,
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndUpdate(offerId, rating, {
        new: true,
      })
      .populate(['owner', 'city'])
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndDelete(offerId)
      .populate(['owner', 'city'])
      .exec();
  }

  public async find(cityId: string): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .find({ city: new ObjectId(cityId) })
      .limit(Offer.CountMax)
      .sort({ createdAt: SortType.Down })
      .populate(['owner', 'city'])
      .exec();
  }

  public async findPremium(
    cityId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .find({ city: new ObjectId(cityId), isPremium: true })
      .limit(Offer.PremiumCountMax)
      .sort({ createdAt: SortType.Down })
      .populate(['owner', 'city'])
      .exec();
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = (await this.offerModel.create(dto)).populate([
      'owner',
      'city',
    ]);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string,
    userId?: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const offer = (await this.offerModel
      .findById(offerId)
      .populate(['owner', 'city'])
      .exec()) as DocumentType<OfferEntity>;

    offer.isFavorite = userId
      ? (await this.favoriteService.checkIsFavorite(offer.id, userId)) ?? false
      : false;
    return offer;
  }

  public async checkOwner(offerId: string, userId: string): Promise<boolean> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate('owner', 'city');
    return offer?.owner.id === userId;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.findById({ _id: offerId })) !== null;
  }
}
