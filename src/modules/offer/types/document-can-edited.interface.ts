export interface DocumentCanEditedInterface {
  checkOwner(offerId: string, userId: string): Promise<boolean>;
}
