import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './app/rest.js';
import { AppComponent } from './types/app-component.enum.js';
import { createRestAppContainer } from './app/rest.container.js';
import { createUserContainer } from './modules/user/user.container.js';

async function bootstrap() {
  const container = Container.merge(
    createRestAppContainer(),
    createUserContainer()
  );

  const application = container.get<RestApplication>(
    AppComponent.RestApplication
  );
  await application.init();
}

bootstrap();
