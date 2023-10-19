import { CityDto } from '../dto/city.dto';
import { CreateCommentDto } from '../dto/comment.dto';
import { OfferDto, UpdateOfferDto } from '../dto/offer.dto';
import { UserDto } from '../dto/user.dto';
import { NewOffer, User, NewComment, City } from '../../types/types';

export const adaptCityToServer = (city: City): CityDto => ({
  name: city.name,
  coordinates: city.location,
});

export const adaptUserToServer = (user: User): UserDto => ({
  name: user.name,
  email: user.email,
  type: user.type,
  avatar: user.avatarUrl,
});

export const adaptOfferToServer = (offer: NewOffer): OfferDto => ({
  title: offer.title,
  description: offer.description,
  date: new Date(),
  city: offer.city,
  preview: offer.previewImage,
  isFavorite: false,
  isPremium: offer.isPremium,
  rooms: offer.bedrooms,
  pictures: offer.images,
  guests: offer.maxAdults,
  equipment: offer.goods,
  houseType: offer.type,
  price: offer.price,
  raiting: 0,
  coordinates: offer.location,
  commentsCount: 0,
});

export const adaptUpdateOfferToServer = (offer: NewOffer): UpdateOfferDto => ({
  title: offer.title,
  description: offer.description,
  date: new Date(),
  city: offer.city,
  preview: offer.previewImage,
  isPremium: offer.isPremium,
  rooms: offer.bedrooms,
  pictures: offer.images,
  guests: offer.maxAdults,
  equipment: offer.goods,
  houseType: offer.type,
  price: offer.price,
  coordinates: offer.location,
});

export const adaptCommentToServer = (comment: NewComment): CreateCommentDto =>
  comment;
