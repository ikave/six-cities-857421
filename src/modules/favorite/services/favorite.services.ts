import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { FavoriteServiceInterface } from './favorite-services.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { FavoriteEntity } from '../entity/favorite.entity.js';

@injectable()
export default class FavoriteServices implements FavoriteServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.FavoriteModel)
    private readonly favoriteModel: ModelType<FavoriteEntity>
  ) {}

  public async add(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity>> {
    let addedOffer = await this.favoriteModel
      .findOne({ offerId, userId })
      .exec();

    if (!addedOffer) {
      addedOffer = await this.favoriteModel.create({
        offer: offerId,
        user: userId,
      });
      this.logger.info(`Offer added to favorites: ${userId}`);
    }

    return addedOffer;
  }

  public async delete(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return await this.favoriteModel
      .findOneAndDelete({ offer: offerId, user: userId })
      .exec();
  }

  public async find(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return await this.favoriteModel
      .find({ user: userId })
      .populate({ path: 'offer', populate: ['owner', 'city'] })
      .exec();
  }

  public async deleteByOffer(offerId: string): Promise<void> {
    await this.favoriteModel.deleteMany({ offer: offerId }).exec();
  }
}
