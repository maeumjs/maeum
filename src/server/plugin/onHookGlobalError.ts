import config from '#configs/config';
import logging from '#logger/bootstrap';
import httpLogging from '#logger/httpLogging';
import IRestError from '#modules/http/IRestError';
import RestError from '#modules/http/RestError';
import encrypt from '#tools/cipher/encrypt';
import getLocales from '#tools/i18n/getLocales';
import escapeSafeStringify from '#tools/misc/escapeSafeStringify';
import { ErrorObject } from 'ajv';
import ErrorStackParser from 'error-stack-parser';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';
import { atOrUndefined, isError } from 'my-easy-fp';

const log = logging(__filename);

function getErrorCode(err: Error, fallbackCode: string) {
  try {
    const frames = ErrorStackParser.parse(err);
    const frame = atOrUndefined(frames, 0);

    if (frame != null) {
      const position = `project://${frame.fileName ?? ''}/${frame.functionName ?? ''}:${
        frame.lineNumber ?? ''
      }:${frame.columnNumber ?? ''}`;
      const code =
        config.server.runMode !== 'production' && config.server.runMode !== 'stage'
          ? position
          : encrypt(position);

      return code;
    }

    return fallbackCode;
  } catch {
    return fallbackCode;
  }
}

export default function onHookGlobalError(
  err: Error & { validation?: ErrorObject[] },
  req: FastifyRequest,
  reply: FastifyReply,
): void {
  try {
    if (err.validation !== undefined) {
      const replyMessage = err.validation
        .map(
          (validationError) =>
            `${validationError.message ?? ''}\n${
              validationError.instancePath
            }\n${escapeSafeStringify(validationError.data)}\n`,
        )
        .join('--\n');

      const code = getErrorCode(err, '85dc84e951a84bf48a35ab5665998b63-02');

      const polyglot = getLocales(req.headers['accept-language']);
      const body: IRestError = {
        code,
        message: `${polyglot.t('common.main.bad_request', {
          allowMissing: true,
        })}\n\n${replyMessage}`,
        status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      };

      setImmediate(() => httpLogging(req, reply, err));
      reply
        .status(httpStatusCodes.BAD_REQUEST)
        .send(body)
        .then(
          () => undefined,
          (caught) => log.trace(caught),
        );

      return;
    }

    if (isError(err) && err instanceof RestError) {
      const code = getErrorCode(err, 'dc71dc02299b4cd297418b6f9aa269f2-02');
      const message = err.getMessage(req.headers['accept-language']);

      const body: IRestError = {
        code,
        message,
        payload: err.payload as unknown,
        status: err.status,
      };

      setImmediate(() => httpLogging(req, reply, err));
      reply
        .status(err.status)
        .send(body)
        .then(
          () => undefined,
          (caught) => log.trace(caught),
        );

      return;
    }

    const code = getErrorCode(err, '662341805eb441ccbfa17c747e6d3549-03');
    const polyglot = getLocales(req.headers['accept-language']);

    const body: IRestError = {
      code,
      message: polyglot.t('common.main.error', { allowMissing: true }),
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    };

    setImmediate(() => httpLogging(req, reply, err));
    reply
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .send(body)
      .then(
        () => undefined,
        (caught) => log.trace(caught),
      );
  } catch (caught) {
    const errorInHook = isError(caught, new Error('unknown error raised'));
    const code = getErrorCode(errorInHook, '662341805eb441ccbfa17c747e6d3549-03');
    const polyglot = getLocales(req.headers['accept-language']);

    const body: IRestError = {
      code,
      message: polyglot.t('common.main.error', { allowMissing: true }),
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    };

    setImmediate(() => httpLogging(req, reply, err));
    reply
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .send(body)
      .then(
        () => undefined,
        (e) => log.trace(e),
      );
  }
}
