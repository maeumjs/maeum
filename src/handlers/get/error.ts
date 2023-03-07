import config from '#configs/config';
import IReplyHealthDto from '#dto/common/IReplyHealthDto';
import { fallbackLng } from '#tools/i18n/i18nConfig';
import { RestError } from '@maeum/error-handler';
import acceptLanguage from 'accept-language';
import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Common'],
    summary: 'Server health check and configuration getting',
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
      400: { $ref: 'IRestError' },
      500: { $ref: 'IRestError' },
    },
  },
};

export default async function errorHandler(req: FastifyRequest<{ Querystring: { ee?: string } }>) {
  const language = acceptLanguage.get(req.headers['accept-language']) ?? fallbackLng;

  if (req.query.ee == null) {
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
