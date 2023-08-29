import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { City } from '../types/city.type.js';
import { HouseType } from '../types/house-type.enum.js';
import { Coordinates } from '../types/coordinates.type.js';
import { UserEntity } from '../../user/entity/user.entity.js';

export interface OfferEntity extends Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends TimeStamps {
  @prop({
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
    default: '',
  })
  public title!: string;

  @prop({
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1024,
    default: '',
  })
  public description!: string;

  @prop({
    type: String,
    required: true,
  })
  public date!: Date;

  @prop({
    required: true,
  })
  public city!: City;

  @prop({
    type: String,
    required: true,
    default: '',
  })
  public preview!: string;

  @prop({
    type: String,
    required: true,
    default: [],
  })
  public pictures!: string[];

  @prop({
    type: Boolean,
    required: true,
  })
  public isPremium!: boolean;

  @prop({
    type: Boolean,
    required: true,
  })
  public isFavorite!: boolean;

  @prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
  })
  public raiting!: number;

  @prop({
    enum: () => HouseType,
    required: true,
  })
  public houseType!: HouseType;

  @prop({
    type: Number,
    required: true,
    min: 1,
    max: 8,
  })
  public rooms!: number;

  @prop({
    type: Number,
    required: true,
    min: 1,
    max: 10,
  })
  public guests!: number;

  @prop({
    type: Number,
    required: true,
    min: 100,
    max: 100000,
  })
  public price!: number;

  @prop({
    type: String,
    required: true,
    default: [],
  })
  public equipment!: string[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public owner!: Ref<UserEntity>;

  @prop({
    type: Number,
    default: 0,
    required: true,
  })
  public commentsCount!: number;

  @prop({
    required: true,
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
