import config from '#configs/config';
import IReplyHealthDto from '#dto/common/IReplyHealthDto';
import { fallbackLng } from '#tools/i18n/i18nConfig';
import acceptLanguage from 'accept-language';
import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Common'],
    summary: 'Server health check and configuration getting',
    response: {
      200: { $ref: 'IReplyHealthDto' },
      400: { $ref: 'IRestError' },
      500: { $ref: 'IRestError' },
    },
  },
};

export default async function healthHandler(req: FastifyRequest) {
  const language = acceptLanguage.get(req.headers['accept-language']) ?? fallbackLng;

  return {
    envMode: config.server.envMode,
    runMode: config.server.runMode,
    port: config.server.port,
    i18n: { language },
  } satisfies IReplyHealthDto;
}
