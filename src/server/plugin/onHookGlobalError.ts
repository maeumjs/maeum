import config from '#configs/config';
import { CE_RUN_MODE } from '#configs/interfaces/CE_RUN_MODE';
import httpLogging from '#loggers/httpLogging';
import encrypt from '#tools/cipher/encrypt';
import getLocales from '#tools/i18n/getLocales';
import { errorHandler } from '@maeum/error-handler';
import { ErrorObject } from 'ajv';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';

export const localeHandler = {
  [httpStatusCodes.BAD_REQUEST]: (
    req: FastifyRequest,
    id: string,
    param?: Record<string, string>,
  ) => getLocales(req.headers['accept-language']).t(id, param),
  [httpStatusCodes.INTERNAL_SERVER_ERROR]: (
    req: FastifyRequest,
    id: string,
    param?: Record<string, string>,
  ) => getLocales(req.headers['accept-language']).t(id, param),
};

export const encryptor: Parameters<typeof errorHandler>[4] = (code: string): string => {
  if (
    config.server.runMode === CE_RUN_MODE.STAGE ||
    config.server.runMode === CE_RUN_MODE.PRODUCTION
  ) {
    return encrypt(code);
  }

  return code;
};

export const hookHandler = {
  [httpStatusCodes.BAD_REQUEST]: (
    err: Error & { validation?: ErrorObject[] },
    req: FastifyRequest,
    reply: FastifyReply,
  ) => {
    setImmediate(() => httpLogging(req, reply, err));
  },
  [httpStatusCodes.INTERNAL_SERVER_ERROR]: (
    err: Error & { validation?: ErrorObject[] },
    req: FastifyRequest,
    reply: FastifyReply,
  ) => {
    setImmediate(() => httpLogging(req, reply, err));
  },
};
