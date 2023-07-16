import { readFileSync } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface';
import { Offer } from '../../types/offer.type';
import { HouseType } from '../../types/house-type.enum';
import { City } from '../../types/city.type';
import { Cities } from '../../types/cities.enum';
import { Equipment } from '../../types/equipment.enum';
import { User } from '../../types/user.type';
import { UserType } from '../../types/user-type.enum';
import { Coordinates } from '../../types/coordinates.type';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';
  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, 'utf8');
  }

  private getCity([cityName, latitude, longitude]: string[]): City {
    return {
      name: cityName as Cities,
      coordinates: {
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      },
    };
  }

  private getEquipment = (equipments: string[]): Equipment[] =>
    equipments.map((equipment) => equipment as Equipment);

  private getOwner = ([
    name,
    email,
    avatar,
    password,
    type,
  ]: string[]): User => ({
    name,
    email,
    avatar,
    password,
    type: type as UserType,
  });

  private getCoordinates = ([latitude, longitude]: string[]): Coordinates => ({
    latitude: Number.parseFloat(latitude),
    longitude: Number.parseFloat(longitude),
  });

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          date,
          city,
          preview,
          pictures,
          isPremium,
          isFavorite,
          raiting,
          houseType,
          rooms,
          guests,
          price,
          equipment,
          owner,
          commentsCount,
          coordinates,
        ]) => ({
          title,
          description,
          date: new Date(date),
          city: this.getCity(city.split(';')),
          preview,
          pictures: pictures.split(';'),
          isPremium: Boolean(isPremium),
          isFavorite: Boolean(isFavorite),
          raiting: Number.parseFloat(raiting),
          houseType: houseType as HouseType,
          rooms: Number.parseInt(rooms, 10),
          guests: Number.parseInt(guests, 10),
          price: Number.parseInt(price, 10),
          equipment: this.getEquipment(equipment.split(';')),
          owner: this.getOwner(owner.split(';')),
          commentsCount: Number.parseInt(commentsCount, 10),
          coordinates: this.getCoordinates(coordinates.split(';')),
        })
      );
  }
}
