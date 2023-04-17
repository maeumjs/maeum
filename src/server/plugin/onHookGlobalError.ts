import config from '#configs/config';
import { CE_RUN_MODE } from '#configs/interfaces/CE_RUN_MODE';
import encrypt from '#tools/cipher/encrypt';
import getLocales from '#tools/i18n/getLocales';
import type {
  TMaeumEncryptor,
  TMaeumErrorHandlerHooks,
  TMaeumErrorHandlerLocales,
  TMaeumMessageIdHandles,
} from '@maeum/error-handler';
import { CE_MAEUM_DEFAULT_ERROR_HANDLER } from '@maeum/error-handler';
import { ErrorObject } from 'ajv';
import type { FastifyRequest } from 'fastify';

export const messages: TMaeumMessageIdHandles = {
  [CE_MAEUM_DEFAULT_ERROR_HANDLER.COMMON]: (id) => `common.main.${id}`,
  [CE_MAEUM_DEFAULT_ERROR_HANDLER.REST_ERROR]: (id) => id,
};

export const locales: TMaeumErrorHandlerLocales = {
  [CE_MAEUM_DEFAULT_ERROR_HANDLER.COMMON]: (req, id, param) =>
    getLocales(req.headers['accept-language']).t(id, param),
};

export const encryptor: TMaeumEncryptor = (code: string): string => {
  if (
    config.server.runMode === CE_RUN_MODE.STAGE ||
    config.server.runMode === CE_RUN_MODE.PRODUCTION
  ) {
    return encrypt(code);
  }

  return code;
};

export const hooks: TMaeumErrorHandlerHooks = {
  [CE_MAEUM_DEFAULT_ERROR_HANDLER.COMMON]: {
    pre: (err: Error & { validation?: ErrorObject[] }, req: FastifyRequest) => {
      req.setRequestError(err);
    },
  },
};
