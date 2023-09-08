import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateCommentDto from '../dto/create-comment.dto.js';
import { CommentEntity } from '../entity/comment.entity.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../core/logger/logger.interface.js';
import { COMMENT_COUNT_MAX } from '../constants.js';
import { OfferServiceInterface } from '../../../modules/offer/services/offer-service.interface.js';
import { SortType } from '../../../types/sort-type.enum.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(AppComponent.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface
  ) {}

  public async create(
    dto: CreateCommentDto,
    offerId: string
  ): Promise<DocumentType<CommentEntity>> {
    await this.offerService.incCommentCount(offerId);

    const result = (await this.commentModel.create(dto)).populate(['owner']);
    this.logger.info(`New comment create ${dto.text}`);

    return result;
  }

  public async findByOfferId(
    offerId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel
      .find({ offer: offerId })
      .limit(COMMENT_COUNT_MAX)
      .sort({ createdAt: SortType.Down })
      .populate(['owner'])
      .exec();
  }

  public async deleteByOffer(offerId: string): Promise<void> {
    await this.commentModel.deleteMany({ offer: offerId });
  }
}
