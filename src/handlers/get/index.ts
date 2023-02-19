import healthHandler from '#handlers/get/health';
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

export default async function indexHandler(req: FastifyRequest) {
  return healthHandler(req);
}
