import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';
import { RestSchema, configRestSchema } from './rest.schema.js';
import { AppComponent } from '../../types/app-component.enum.js';

@injectable()
export default class ConfigService implements ConfigInterface<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(AppComponent.LoggerInterface)
    private readonly logger: LoggerInterface
  ) {
    const parsedOutput = config();

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();

    if (parsedOutput.error) {
      throw new Error(
        'Can not read .env file. Perhaps the file does not exists.'
      );
    }

    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }

  public getPath(): string {
    return `${this.get('SERVER_HOST')}:${this.get('PORT')}`;
  }
}
