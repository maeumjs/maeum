import logging from '#loggers/bootstrap';
import httpLogging from '#loggers/httpLogging';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { isError } from 'my-easy-fp';

const log = logging(__filename);

const loggingPlugin = fastifyPlugin(
  function loggingHandle(
    fastify: FastifyInstance,
    options:
      | {
          isPayloadLogging?: boolean;
        }
      | undefined,
    pluginDone: (err?: Error) => void,
  ) {
    const isPayloadLogging = options?.isPayloadLogging ?? false;

    fastify.addHook('onSend', (req: FastifyRequest, _reply, payload, done) => {
      if (isPayloadLogging) {
        req.setRequestPayload(payload);
      }

      done(null, payload);
    });

    fastify.addHook('onResponse', (req, reply) => {
      httpLogging(req, reply, {
        payloadLogging: process.env.ENV_PAYLOAD_LOGGING === 'true',
        useSnappy: process.env.ENV_PAYLOAD_LOGGING === 'true',
      }).catch((caught) => {
        const err = isError(caught, new Error('unknown error raised from onResponse Hook'));
        log.trace(err.message);
        log.trace(err.stack);
      });
    });

    pluginDone();
  },
  {
    fastify: '4.x',
    name: 'maeum-logging-plugin',
  },
);

export default loggingPlugin;
