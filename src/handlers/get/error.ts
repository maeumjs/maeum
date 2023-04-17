import config from '#configs/config';
import IReplyHealthDto from '#dto/common/IReplyHealthDto';
import { fallbackLng } from '#tools/i18n/i18nConfig';
import { RestError, maeumRestErrorSchema } from '@maeum/error-handler';
import acceptLanguage from 'accept-language';
import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Common'],
    summary: 'Server health check and configuration getting',
    operationId: 'raise-error',
    hide: true,
    querystring: {
      type: 'object',
      properties: {
        ee: {
          type: 'string',
        },
      },
    },
    response: {
      200: { $ref: 'IReplyHealthDto' },
      400: maeumRestErrorSchema,
      500: maeumRestErrorSchema,
    },
  },
};

export default async function errorHandler(
  req: FastifyRequest<{ Querystring: { ee?: string; code?: string; pe?: string } }>,
) {
  const language = acceptLanguage.get(req.headers['accept-language']) ?? fallbackLng;

  if (req.query.ee == null) {
    if (req.query.code != null) {
      throw RestError.create({
        code: req.query.code,
        polyglot: { id: 'common.main.error' },
        data: { description: 'this is a test payload' },
      });
    }

    if (req.query.pe != null) {
      throw new Error('plain error raised');
    }

    throw RestError.create({
      polyglot: { id: 'common.main.error' },
      data: { description: 'this is a test payload' },
    });
  }

  return {
    envMode: config.server.envMode,
    runMode: config.server.runMode,
    port: config.server.port,
    i18n: { language },
  } satisfies IReplyHealthDto;
}
