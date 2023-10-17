import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { FavoriteEntity } from '../entity/favorite.entity.js';
import { SortType } from '../../../types/sort-type.enum.js';

@injectable()
export default class FavoriteServices implements FavoriteServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.FavoriteModel)
    private readonly favoriteModel: ModelType<FavoriteEntity>
  ) {}

  public async addToFavorites(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity>> {
    let addedOffer = await this.favoriteModel
      .findOne({ offer: offerId, user: userId })
      .populate({ path: 'offer', populate: ['city', 'owner'] })
      .exec();

    if (!addedOffer) {
      addedOffer = await (
        await this.favoriteModel.create({
          offer: offerId,
          user: userId,
        })
      ).populate({ path: 'offer', populate: ['city', 'owner'] });
      this.logger.info(`Offer added to favorites: ${userId}`);
    }

    return addedOffer;
  }

  public async removeFromFavorites(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return await this.favoriteModel
      .findOneAndDelete({ offer: offerId, user: userId })
      .populate({ path: 'offer', populate: ['city', 'owner'] })
      .exec();
  }

  public async findFavorites(
    userId: string
  ): Promise<DocumentType<FavoriteEntity>[]> {
    return await this.favoriteModel
      .find({ user: userId })
      .populate({ path: 'offer', populate: ['city', 'owner'] })
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async deleteByOffer(offerId: string): Promise<void> {
    await this.favoriteModel.deleteMany({ offer: offerId }).exec();
  }

  public async checkIsFavorite(
    offerId: string,
    userId?: string
  ): Promise<boolean> {
    const result = await this.favoriteModel.findOne({
      offer: offerId,
      user: userId,
    });

    return !!result;
  }
}
