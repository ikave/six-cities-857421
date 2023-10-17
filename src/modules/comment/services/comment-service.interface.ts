import { DocumentType } from '@typegoose/typegoose';
import CreateCommentDto from '../dto/create-comment.dto.js';
import { CommentEntity } from '../entity/comment.entity.js';

export interface CommentServiceInterface {
  create(
    dto: CreateCommentDto,
    offerId: string
  ): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOffer(offerId: string): Promise<void>;
}
