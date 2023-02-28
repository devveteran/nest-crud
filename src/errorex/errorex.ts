import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

export class ErrorEx extends Error {
  public readonly name: string;
  public readonly httpCode: ErrorHttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: ErrorHttpStatusCode,
    description: string,
    isOperationl: boolean,
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperationl;

    Error.captureStackTrace(this);
  }

  toJSON(): string {
    const obj = {
      name: this.name,
      httpCode: this.httpCode,
      message: this.message,
      isOperational: this.isOperational,
    };
    return JSON.stringify(obj);
  }
}
