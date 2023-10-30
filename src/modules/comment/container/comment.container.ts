import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from '../services/comment-service.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import CommentService from '../services/comment.service.js';
import { CommentEntity, CommentModel } from '../entity/comment.entity.js';
import { ControllerInterface } from '../../../core/controller/controller.interface.js';
import CommentController from '../controller/comment.controller.js';

export function createCommentContainer() {
  const container = new Container();

  container
    .bind<CommentServiceInterface>(AppComponent.CommentServiceInterface)
    .to(CommentService);

  container
    .bind<types.ModelType<CommentEntity>>(AppComponent.CommentModel)
    .toConstantValue(CommentModel);

  container
    .bind<ControllerInterface>(AppComponent.CommentController)
    .to(CommentController)
    .inSingletonScope();

  return container;
}
