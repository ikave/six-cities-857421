import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from '../entity/favorite.entity.js';

export interface FavoriteServiceInterface {
  addToFavorites(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity>>;
  removeFromFavorites(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  deleteByOffer(offerId: string): Promise<void>;
}
