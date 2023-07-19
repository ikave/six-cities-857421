import { Cities } from '../../types/cities.enum';
import { City } from '../../types/city.type';
import { Coordinates } from '../../types/coordinates.type';
import { Equipment } from '../../types/equipment.enum';
import { HouseType } from '../../types/house-type.enum';
import { Offer } from '../../types/offer.type';
import { UserType } from '../../types/user-type.enum';
import { User } from '../../types/user.type';

const getCity = ([cityName, latitude, longitude]: string[]): City => ({
  name: cityName as Cities,
  coordinates: {
    latitude: Number.parseFloat(latitude),
    longitude: Number.parseFloat(longitude),
  },
});

export const transformCityObjectToString = ({
  name,
  coordinates: { latitude, longitude },
}: City): string => `${name};${latitude};${longitude}`;

const getEquipment = (equipments: string[]): Equipment[] =>
  equipments.map((equipment) => equipment as Equipment);

const getOwner = ([name, email, avatar, password, type]: string[]): User => ({
  name,
  email,
  avatar,
  password,
  type: type as UserType,
});

const getCoordinates = ([latitude, longitude]: string[]): Coordinates => ({
  latitude: Number.parseFloat(latitude),
  longitude: Number.parseFloat(longitude),
});

export function createOffer(offerData: string): Offer {
  const [
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
  ] = offerData.replace('\n', '').split('\t');

  return {
    title,
    description,
    date: new Date(date),
    city: getCity(city.split(';')),
    preview,
    pictures: pictures.split(';'),
    isPremium: Boolean(isPremium),
    isFavorite: Boolean(isFavorite),
    raiting: Number.parseFloat(raiting),
    houseType: houseType as HouseType,
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    equipment: getEquipment(equipment.split(';')),
    owner: getOwner(owner.split(';')),
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: getCoordinates(coordinates.split(';')),
  };
}
