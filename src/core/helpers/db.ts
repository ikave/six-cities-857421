interface MongoUriProps {
  username: string;
  password: string;
  host: string;
  port: string;
  databaseName: string;
}

export const getMongoURI = ({
  username,
  password,
  host,
  port,
  databaseName,
}: MongoUriProps): string =>
  `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
