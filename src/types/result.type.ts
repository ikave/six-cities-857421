export interface IResult<Err, Res> {
  readonly result: Res;
  readonly error: Err;
}

export type ErrorItem = { message: string; code?: number; forDeveloper?: any };
export type Result<Res, Err = ErrorItem> =
  | IResult<Err[], undefined>
  | IResult<undefined, Res>;

export class ErrorResult implements IResult<ErrorItem[], undefined> {
  result = undefined;
  constructor(public error: ErrorItem[]) {
    if (!error) {
      console.log(1);
    }
  }
}

export class FatalErrorResult implements IResult<ErrorItem[], undefined> {
  result = undefined;
  error = [{ message: 'Something went wrong' }];

  private exception?: any;

  constructor(private _error: ErrorItem[], exception?: any) {
    if (!_error) {
      this.exception = exception;
    }
  }
}

export class SuccessResult<T> implements IResult<undefined, T> {
  error = undefined;
  constructor(public result: T) {}
}

export class ErrorResultException extends Error {
  constructor(public readonly errors: ErrorItem[]) {
    super(errors.map((m) => m.message).join(', '));
  }
}

export class FieldErrorResult extends ErrorResult {
  constructor(public readonly fieldErrors: Record<string, string[]>) {
    super(
      Object.values(fieldErrors)
        .flat()
        .map((message) => ({ message }))
    );
  }
}
