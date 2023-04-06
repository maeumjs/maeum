import config from '#configs/config';
import IReplyHealthDto from '#dto/common/IReplyHealthDto';
import { fallbackLng } from '#tools/i18n/i18nConfig';
import { maeumRestErrorSchema } from '@maeum/error-handler';
import acceptLanguage from 'accept-language';
import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Common'],
    summary: 'Server health check and configuration getting',
    operationId: 'get-server-health',
    response: {
      200: { $ref: 'IReplyHealthDto' },
      400: maeumRestErrorSchema,
      500: maeumRestErrorSchema,
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
