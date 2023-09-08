import { DocumentType } from '@typegoose/typegoose';
import createCommentDto from '../dto/create-comment.dto.js';
import { CommentEntity } from '../entity/comment.entity.js';

export interface CommentServiceInterface {
  create(
    dto: createCommentDto,
    offerId: string
  ): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOffer(offerId: string): Promise<void>;
}
