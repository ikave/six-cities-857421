import { DatabaseClientInterface } from '../database-client/database-client.interface.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { createOffer } from '../helpers/offers.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { CLICommandInterface } from './cli-command.interface.js';
import { getMongoURI } from '../helpers/db.js';
import ConsoleService from '../logger/console.service.js';
import { UserServiceInterface } from '../../modules/user/services/user-service.interface.js';
import { OfferServiceInterface } from '../../modules/offer/services/offer-service.interface.js';
import { UserModel } from '../../modules/user/entity/user.entity.js';
import { OfferModel } from '../../modules/offer/entity/offer.entity.js';
import OfferService from '../../modules/offer/services/offer.service.js';
import { Offer } from '../../modules/offer/types/offer.type.js';
import UserService from '../../modules/user/services/user.service.js';
import { CityServiceInterface } from '../../modules/city/services/city-service.interface.js';
import { CityService } from '../../modules/city/services/city.service.js';
import { CityModel } from '../../modules/city/entity/city.entity.js';
import ConfigService from '../config/config.service.js';
import FavoriteService from '../../modules/favorite/services/favorite.service.js';
import { FavoriteModel } from '../../modules/favorite/entity/favorite.entity.js';

const DEFAULT_DB_PORT = '27017';

export default class ImportCommand implements CLICommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private offerService!: OfferServiceInterface;
  private cityService!: CityServiceInterface;
  private favoriteService!: FavoriteService;
  private configService!: ConfigService;
  private logger!: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onComplite = this.onComplite.bind(this);
    this.onRow = this.onRow.bind(this);

    this.logger = new ConsoleService();
    this.configService = new ConfigService(this.logger);
    this.userService = new UserService(
      this.logger,
      UserModel,
      this.configService
    );
    this.favoriteService = new FavoriteService(this.logger, FavoriteModel);
    this.databaseService = new MongoClientService(this.logger);
    this.offerService = new OfferService(
      this.logger,
      OfferModel,
      this.favoriteService
    );
    this.cityService = new CityService(this.logger, CityModel);
  }

  private async saveOffer(offer: Offer) {
    const city = await this.cityService.findOrCreate({
      name: offer.city.name,
      coordinates: offer.city.coordinates,
    });

    const user = await this.userService.findOrCreate(
      {
        ...offer.owner,
        password: '123456',
      },
      this.salt
    );

    await this.offerService.create({
      ...offer,
      city: city.id,
      owner: user.id,
    });
  }

  private onRow = async (row: string, resolve: () => void) => {
    const offer = createOffer(row);

    await this.saveOffer({
      ...offer,
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
