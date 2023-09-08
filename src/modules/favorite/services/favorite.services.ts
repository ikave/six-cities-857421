import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { FavoriteServiceInterface } from './favorite-services.interface.js';
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

  public async add(
    offer: string,
    user: string
  ): Promise<DocumentType<FavoriteEntity>> {
    let addedOffer = await this.favoriteModel.findOne({ offer, user }).exec();

    if (!addedOffer) {
      addedOffer = await this.favoriteModel.create({
        offer,
        user,
      });
      this.logger.info(`Offer added to favorites: ${user}`);
    }

    return addedOffer;
  }

  public async delete(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return await this.favoriteModel
      .findOneAndDelete({ offer: offerId, user: userId })
      .populate({ path: 'offer', populate: ['owner', 'city'] })
      .exec();
  }

  public async find(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return await this.favoriteModel
      .find({ user: userId })
      .populate({ path: 'offer', populate: ['owner', 'city'] })
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async deleteByOffer(offerId: string): Promise<void> {
    await this.favoriteModel.deleteMany({ offer: offerId }).exec();
  }
}
