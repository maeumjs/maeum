/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import IPolyglot from '#modules/http/IPolyglot';
import IRestError from '#modules/http/IRestError';
import getLocales from '#tools/i18n/getLocales';
import ErrorStackParser from 'error-stack-parser';
import httpStatusCodes from 'http-status-codes';

type TRestErrorArgs<T> =
  | Error
  | RestError<T>
  | (Omit<IRestError, 'code' | 'status' | 'message'> & {
      status?: number;
      message: string;
      logging?: Record<string, string>;
    })
  | (Omit<IRestError, 'code' | 'status' | 'message'> & {
      status?: number;
      polyglot: IPolyglot;
      logging?: Record<string, string>;
    });

export default class RestError<T = unknown> extends Error implements Omit<IRestError, 'code'> {
  /** message of error */
  public readonly message: string;

  /** payload for response */
  public readonly payload?: T;

  /** http status code */
  public readonly status: number;

  /** polyglot information */
  public readonly polyglot?: IPolyglot;

  /** additional information for logging */
  public readonly logging?: Record<string, unknown>;

  getMessage(lang?: string) {
    if (this.polyglot != null) {
      const polyglot = getLocales(lang);
      return polyglot.t(this.polyglot.id, this.polyglot.params);
    }

    return this.message;
  }

  public static getRefiedStack<T>(err: RestError<T>): string | undefined {
    try {
      const frames = ErrorStackParser.parse(err);
      return `Error: ${err.message}${frames
        .slice(1, frames.length)
        .map((frame) => frame.source)
        .filter((frame): frame is string => frame != null)
        .join('\n')}`;
    } catch {
      return err.stack;
    }
  }

  public static create<T>(args: TRestErrorArgs<T>): RestError<T> {
    if (args instanceof Error) {
      const err = new RestError<T>({
        message: args.message,
        status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      });

      err.stack = args.stack;
      return err;
    }

    if (args instanceof RestError) {
      const err = new RestError<T>({
        payload: args.payload,
        status: args.status,
        message: args.message,
        polyglot: args.polyglot,
        logging: args.logging,
      });

      err.stack = args.stack;
      return err;
    }

    if ('polyglot' in args) {
      const err = new RestError<T>({
        payload: args.payload,
        status: args.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR,
        message: args.polyglot.id,
        polyglot: args.polyglot,
        logging: args.logging,
      });

      err.stack = RestError.getRefiedStack(err);
      return err;
    }

    const err = new RestError<T>({
      payload: args.payload,
      status: args.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR,
      message: args.message,
      logging: args.logging,
    });

    err.stack = RestError.getRefiedStack(err);
    return err;
  }

  private constructor({
    payload,
    status,
    message,
    polyglot,
    logging,
  }: {
    payload?: T;
    status?: number;
    message?: string;
    polyglot?: IPolyglot;
    logging?: Record<string, string>;
  }) {
    super(message ?? polyglot?.id ?? '');

    this.payload = payload;
    this.message = message ?? polyglot?.id ?? '';
    this.logging = logging;
    this.polyglot = polyglot;
    this.status = status ?? httpStatusCodes.INTERNAL_SERVER_ERROR;
  }
}
