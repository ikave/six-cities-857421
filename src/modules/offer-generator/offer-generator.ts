import dayjs from 'dayjs';
import {
  getRandomBoolean,
  getRandomItem,
  getRandomItems,
  getRandomNumber,
  transformCityObjectToString,
} from '../../core/helpers/index.js';
import { Coordinates } from '../../types/coordinates.type.js';
import { Equipment } from '../offer/types/equipment.enum.js';
import { HouseType } from '../offer/types/house-type.enum.js';
import { User } from '../user/types/user.type.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { MockData } from '../../types/mock-data.type.js';
import { City } from '../offer/types/city.type.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const RATING_MIN = 1;
const RATING_MAX = 5;

const ROOMS_MIN = 1;
const ROOMS_MAX = 8;

const GUESTS_MIN = 1;
const GUESTS_MAX = 10;

const PRICE_MIN = 100;
const PRICE_MAX = 100000;

export class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.title);
    const description = getRandomItem<string>(this.mockData.description);
    const date = dayjs()
      .subtract(getRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY))
      .toISOString();
    const city = transformCityObjectToString(
      getRandomItem<City>(this.mockData.cities)
    );
    const preview = getRandomItem<string>(this.mockData.preview);
    const pictures = this.mockData.pictures.join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = false;
    const rating = getRandomNumber(RATING_MIN, RATING_MAX, 1);
    const houseType = getRandomItem<HouseType>(this.mockData.houseType);
    const rooms = getRandomNumber(ROOMS_MIN, ROOMS_MAX);
    const guests = getRandomNumber(GUESTS_MIN, GUESTS_MAX);
    const price = getRandomNumber(PRICE_MIN, PRICE_MAX);
    const equipment = getRandomItems<Equipment>(this.mockData.equipment).join(
      ';'
    );
    const owner = Object.values(getRandomItem<User>(this.mockData.owner)).join(
      ';'
    );
    const commentsCount = getRandomItem<number>(this.mockData.commentsCount);
    const coordinates = Object.values(
      getRandomItem<Coordinates>(this.mockData.coordinates)
    ).join(';');
    return [
      title,
      description,
      date,
      city,
      preview,
      pictures,
      isPremium,
      isFavorite,
      rating,
      houseType,
      rooms,
      guests,
      price,
      equipment,
      owner,
      commentsCount,
      coordinates,
    ].join('\t');
  }
}
