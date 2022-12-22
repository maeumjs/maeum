import IRestError from '@module/http/IRestError';
import httpStatusCodes from 'http-status-codes';

export default class RestError<T> extends Error implements Omit<IRestError, 'code'> {
  /** message of error */
  public readonly message: string;

  /** payload for response */
  public readonly payload?: T;

  /** http status code */
  public readonly status: number;

  /** polyglot information */
  public readonly polyglot?: {
    id: string;
    params?: Record<string, string>;
  };

  /** additional information for logging */
  public readonly logging?: Record<string, any>;

  constructor({ message, payload, status }: Omit<IRestError, 'status'> & { status?: number }) {
    super(message);

    this.payload = payload;
    this.message = message;
    this.status = status ?? httpStatusCodes.INTERNAL_SERVER_ERROR;
  }
}
