import { Cities } from '../../modules/offer/types/cities.enum.js';
import { City } from '../../modules/offer/types/city.type.js';
import { Coordinates } from '../../types/coordinates.type.js';
import { Equipment } from '../../modules/offer/types/equipment.enum.js';
import { HouseType } from '../../modules/offer/types/house-type.enum.js';
import { Offer } from '../../modules/offer/types/offer.type.js';
import { UserType } from '../../modules/user/types/user-type.enum.js';
import { User } from '../../modules/user/types/user.type.js';

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

const getOwner = ([name, email, avatar, type]: string[]): User => ({
  name,
  email,
  avatar,
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
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
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
