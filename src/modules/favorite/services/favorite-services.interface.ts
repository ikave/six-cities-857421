import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from '../entity/favorite.entity.js';

export interface FavoriteServiceInterface {
  add(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null>;
  delete(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null>;
  find(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  deleteByOffer(offerId: string): Promise<void>;
}
