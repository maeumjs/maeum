import config from '#configs/config';
import route from '#handlers/route';
import logging from '#loggers/bootstrap';
import { CE_LOG_PROTOCOL } from '#loggers/interface/CE_LOG_PROTOCOL';
import { CE_HEADER_KEY } from '#server/modules/CE_HEADER_KEY';
import optionFactory from '#server/modules/optionFactory';
import loggingFlagPlugin from '#server/plugin/loggingFlagPlugin';
import * as errorHook from '#server/plugin/onHookGlobalError';
import onHookResponse from '#server/plugin/onHookResponse';
import swaggerConfig from '#server/plugin/swaggerConfig';
import swaggerUiConfig from '#server/plugin/swaggerUiConfig';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastifyUrlData from '@fastify/url-data';
import { errorHandler } from '@maeum/error-handler';
import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import httpStatusCodes from 'http-status-codes';

const log = logging(__filename);

let server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

export async function bootstrap(): Promise<FastifyInstance> {
  const { fastify } = optionFactory();

  server = fastify;

  await server.register(fastifyUrlData).register(fastifyCors).register(loggingFlagPlugin);

  await server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    sharedSchemaId: 'fileUploadSchema',
  });

  // If server start production mode, disable swagger-ui
  if (config.server.runMode !== 'production') {
    await server.register(fastifySwagger, swaggerConfig());
    await server.register(fastifySwaggerUI, swaggerUiConfig());
  }

  server.setErrorHandler(
    errorHandler(
      [],
      'common.main.',
      errorHook.localeHandler,
      errorHook.hookHandler,
      errorHook.encryptor,
    ),
  );
  server.addHook('onResponse', onHookResponse);

  // Replace responseTime plugin
  // via: https://www.fastify.io/docs/Reference/Reply/#getresponsetime
  if (config.server.runMode !== 'production') {
    server.addHook('onSend', (_req, reply, _data, done) => {
      reply.header(CE_HEADER_KEY.RESPONSE_TIME, reply.getResponseTime()).then(
        () => undefined,
        (err) => log.trace(err),
      );
      done();
    });
  }

  route(server);

  return server;
}

export async function unbootstrap() {
  await server.close();
}

export function listen(port: number): void {
  log.info({
    status: httpStatusCodes.OK,
    duration: -1,
    req_method: 'SYS',
    req_url: `${CE_LOG_PROTOCOL.FASTIFY}start/port:${port}/pid:${process.pid}`,
    body: { port, run_mode: config.server.runMode },
  });

  server.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err != null) {
      log.crit({
        status: httpStatusCodes.INTERNAL_SERVER_ERROR,
        duration: -1,
        req_method: 'SYS',
        req_url: `${CE_LOG_PROTOCOL.FASTIFY}start/port:${port}/pid:${process.pid}`,
        err_msg: err.message,
        err_stk: err.stack,
        body: { port, run_mode: config.server.runMode, address },
      });

      throw err;
    }

    log.info({
      status: httpStatusCodes.OK,
      duration: -1,
      req_method: 'SYS',
      req_url: `${CE_LOG_PROTOCOL.FASTIFY}localhost:${port}/${process.pid}/start`,
      body: { port, run_mode: config.server.runMode, address },
    });

    log.trace(`Server start: [${port}:] localhost:${port}-${process.pid}/start`);

    // for pm2
    if (process.send != null) {
      process.send('ready');
    }
  });
}
