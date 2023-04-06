import healthHandler, { option as healthOption } from '#handlers/get/health';
import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  ...healthOption,
  schema: {
    ...healthOption.schema,
    operationId: 'get-root-server-health',
    hide: true,
  },
};

export default async function indexHandler(req: FastifyRequest) {
  return healthHandler(req);
}
