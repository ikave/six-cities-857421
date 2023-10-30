export interface DocumentExistsInterface {
  exists(id: string): Promise<boolean>;
}
