import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { OfferEntity } from '../../offer/entity/offer.entity.js';
import { UserEntity } from '../../user/entity/user.entity.js';

export interface FavoriteEntity extends Base, TimeStamps {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites',
  },
})
export class FavoriteEntity {
  @prop({
    ref: UserEntity,
    required: true,
  })
  public user!: Ref<UserEntity>;

  @prop({
    ref: OfferEntity,
    required: true,
  })
  public offer!: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
