// import { UserDto } from '../../dto/user.dto';
import { CityRdo } from '../rdo/city.rdo';
import CommentRdo from '../rdo/comment.rdo';
import { OfferRdo } from '../rdo/offer.rdo';
import UserRdo from '../rdo/user.rdo';
import { City, Comment, Offer, User } from '../../types/types';

export const adaptCityToClient = (city: CityRdo): City => ({
  name: city.name,
  location: city.coordinates,
});

export const adaptCitiesToClient = (cities: CityRdo[]): City[] =>
  cities.map((city) => adaptCityToClient(city));

export const adaptUserToClient = (user: UserRdo): User => ({
  name: user.name,
  email: user.email,
  type: user.type,
  avatarUrl: user.avatar,
});

export const adaptOfferToClient = (offer: OfferRdo): Offer => ({
  id: offer.id,
  title: offer.title,
  previewImage: offer.preview,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  rating: offer.raiting,
  type: offer.houseType,
  price: offer.price,
  city: adaptCityToClient(offer.city),
  location: offer.coordinates,
  bedrooms: offer.rooms,
  description: offer.description,
  goods: offer.equipment,
  host: adaptUserToClient(offer.owner),
  images: offer.pictures,
  maxAdults: offer.guests,
});

export const adaptOffersToClient = (offers: OfferRdo[]): Offer[] =>
  offers.map((offer: OfferRdo) => adaptOfferToClient(offer));

export const adaptCommentsToClient = (comments: CommentRdo[]): Comment[] =>
  comments.map((comment: CommentRdo): Comment => adaptCommentToClient(comment));

export const adaptCommentToClient = (comment: CommentRdo): Comment => ({
  comment: comment.comment,
  id: comment.id,
  date: comment.date,
  rating: comment.rating,
  user: adaptUserToClient(comment.owner),
});
