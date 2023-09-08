import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import * as crypto from 'node:crypto';
import { ValidationErrorField } from '../../types/validation-error-field.type.js';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDto = <T, V>(dto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(dto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});

export const transformErrors = (
  errors: ValidationError[]
): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
