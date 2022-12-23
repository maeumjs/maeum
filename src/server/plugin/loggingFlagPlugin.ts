import { FastifyInstance } from 'fastify';
import fastifyPlugin, { PluginMetadata } from 'fastify-plugin';

const loggingFlagPlugin = fastifyPlugin(function loggingFlag(
  fastify: FastifyInstance,
  _options: PluginMetadata,
  done: (err?: Error) => void,
) {
  fastify.decorateRequest('setRequestLogging', function setRequestLogging() {
    this.isLogged = true;
  });

  fastify.decorateRequest('getIsRequestLogging', function getIsRequestLogging(): boolean {
    return this.isLogged;
  });

  done();
});

export default loggingFlagPlugin;
