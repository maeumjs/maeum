import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const responseTimePlugin = fastifyPlugin(function loggingFlag(
  fastify: FastifyInstance,
  options: { key?: string; cond?: () => boolean },
  done: (err?: Error) => void,
) {
  const key = options.key ?? 'X-Response-Time';

  if (options.cond?.() ?? true) {
    // Replace responseTime plugin
    // via: https://www.fastify.io/docs/Reference/Reply/#getresponsetime
    fastify.addHook('onSend', (_req, reply, data, hookDone) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      reply.header(key, reply.getResponseTime());
      hookDone(null, data);
    });
  }

  done();
});

export default responseTimePlugin;
