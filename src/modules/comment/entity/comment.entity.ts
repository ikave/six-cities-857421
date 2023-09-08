import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { UserEntity } from '../../user/entity/user.entity.js';
import { OfferEntity } from '../../offer/entity/offer.entity.js';

export interface CommentEntity extends Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class CommentEntity extends TimeStamps {
  @prop({
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
    default: '',
  })
  public text!: string;

  @prop()
  public date!: Date;

  @prop({ type: Number, min: 1, max: 5, required: true })
  public rating!: number;

  @prop({ ref: UserEntity, required: true })
  public owner!: Ref<UserEntity>;

  @prop({ ref: OfferEntity, required: true })
  public offer!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
