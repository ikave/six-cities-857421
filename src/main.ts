import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './app/rest.js';
import { AppComponent } from './types/app-component.enum.js';
import { createRestAppContainer } from './app/rest.container.js';
import { createUserContainer } from './modules/user/container/user.container.js';
import { createOfferContainer } from './modules/offer/container/offer.container.js';
import { createCommentContainer } from './modules/comment/container/comment.container.js';
import { createFavoriteContainer } from './modules/favorite/container/favorite.container.js';

async function bootstrap() {
  const container = Container.merge(
    createRestAppContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createFavoriteContainer()
  );

  const application = container.get<RestApplication>(
    AppComponent.RestApplication
  );
  await application.init();
}

bootstrap();
