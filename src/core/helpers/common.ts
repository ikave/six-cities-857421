import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import * as crypto from 'node:crypto';
import * as jose from 'jose';
import { ValidationErrorField } from '../../types/validation-error-field.type.js';
import { ServiceError } from '../../types/service-error.enum.js';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDto = <T, V>(dto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(dto, plainObject, { excludeExtraneousValues: true });

export const createJWT = async (
  algorithm: string,
  jwtSecret: string,
  payload: object
): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (
  errors: ValidationError[]
): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));

export const createErrorObject = (
  serviceError: ServiceError,
  message: string,
  details: ValidationErrorField[] = []
) => ({
  errorType: serviceError,
  message,
  details,
});
