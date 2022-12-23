import config from '@config/config';
import httpLogging from '@logger/httpLogging';
import IRestError from '@module/http/IRestError';
import RestError from '@module/http/RestError';
import encrypt from '@tool/cipher/encrypt';
import getLocales from '@tool/i18n/getLocales';
import { ErrorObject } from 'ajv';
import ErrorStackParser from 'error-stack-parser';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';
import { first, isError } from 'my-easy-fp';

export default function onHookGlobalError(
  err: Error & { validation?: ErrorObject[] },
  req: FastifyRequest,
  reply: FastifyReply,
): void {
  if (err.validation !== undefined) {
    const replyMessage = err.validation
      .map(
        (validationError) =>
          `${validationError.message}\n${validationError.instancePath}\n${validationError.data}\n`,
      )
      .join('--\n');

    const polyglot = getLocales(req.headers['accept-language']);
    const body: IRestError = {
      code: '85dc84e951a84bf48a35ab5665998b63',
      message: `${polyglot.t('common.main.bad_request', {
        allowMissing: true,
      })}\n\n${replyMessage}`,
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    };

    setImmediate(() => httpLogging(req, reply, err));
    reply.status(httpStatusCodes.BAD_REQUEST).send(body);

    return;
  }

  if (isError(err) && err instanceof RestError) {
    const frames = ErrorStackParser.parse(err);
    const frame = first(frames);

    const position = `project://${frame.fileName}/${frame.functionName}:${frame.lineNumber}:${frame.columnNumber}`;
    const code =
      config.server.runMode !== 'production' && config.server.runMode !== 'stage'
        ? position
        : encrypt(position);

    const message = err.getMessage(req.headers['accept-language']);

    const body: IRestError = {
      code,
      message,
      payload: err.payload,
      status: err.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR,
    };

    setImmediate(() => httpLogging(req, reply, err));
    reply.status(err.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR).send(body);
    return;
  }

  const polyglot = getLocales(req.headers['accept-language']);
  const body: IRestError = {
    code: '88a417dad2bd4f0ba4540b7ffabf3e5d',
    message: polyglot.t('common.main.error', { allowMissing: true }),
    status: httpStatusCodes.INTERNAL_SERVER_ERROR,
  };

  setImmediate(() => httpLogging(req, reply, err));
  reply.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(body);
}
