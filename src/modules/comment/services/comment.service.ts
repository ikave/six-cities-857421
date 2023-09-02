import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateCommentDto from '../dto/create-comment.dto.js';
import { CommentEntity } from '../entity/comment.entity.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { COMMENT_COUNT_MAX } from '../constants.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New comment create ${dto.text}`);

    return result;
  }

  public async findByOfferId(
    offerId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel
      .find({ offerId })
      .limit(COMMENT_COUNT_MAX)
      .populate(['owner'])
      .exec();
  }
}
