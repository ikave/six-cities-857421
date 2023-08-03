import { UserServiceInterface } from '~/modules/user/services/user-service.interface.js';
import UserService from '~/modules/user/services/user.service.js';
import { UserModel } from '~/modules/user/entity/user.entity.js';
import { Offer } from '~/modules/offer/types/offer.type.js';
import { DatabaseClientInterface } from '../database-client/database-client.interface.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { createOffer } from '../helpers/offers.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { CLICommandInterface } from './cli-command.interface.js';
import { OfferServiceInterface } from '../../modules/offer/services/offer-service.interface.js';
import OfferService from '../../modules/offer/services/offer.service.js';
import { OfferModel } from '../../modules/offer/entity/offer.entity.js';
import { getMongoURI } from '../helpers/db.js';
import ConsoleService from '../logger/console.service.js';

const DEFAULT_DB_PORT = '27017';

export default class ImportCommand implements CLICommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private offerService!: OfferServiceInterface;
  private logger!: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onComplite = this.onComplite.bind(this);
    this.onRow = this.onRow.bind(this);

    this.logger = new ConsoleService();
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
    this.offerService = new OfferService(this.logger, OfferModel);
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate(
      {
        ...offer.owner,
        password: '123141',
      },
      this.salt
    );

    await this.offerService.create({
      ...offer,
      owner: user.id,
    });
  }

  private onRow = async (row: string, resolve: () => void) => {
    const offer = createOffer(row);

    await this.saveOffer({
      ...offer,
      city: { name: offer.city.name, coordinates: offer.city.coordinates },
      equipment: [...offer.equipment],
      coordinates: offer.coordinates,
    });
    resolve();
  };

  private onComplite = async () => {
    console.log('Data is imported.');
    this.databaseService.disconnect();
  };

  public async execute(
    filename: string,
    username: string,
    password: string,
    host: string,
    databaseName: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI({
      username,
      password,
      host,
      databaseName,
      port: DEFAULT_DB_PORT,
    });
    this.salt = salt;
    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('row', this.onRow);
    fileReader.on('end', this.onComplite);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      console.log(
        `Не удалось импортировать данные из файла по причине: «${error.message}»`
      );
    }
  }
}
