import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from '../dto/create-offer.dto.js';
import { OfferEntity } from '../entity/offer.entity.js';
import UpdateOfferDto from '../dto/update-offer.dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    dto: UpdateOfferDto,
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findPremium(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  checkOwner(offerId: string, userId: string): Promise<boolean>;
  exists(offerId: string): Promise<boolean>;
}
