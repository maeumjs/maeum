import ajv, { ajvOptions } from '#configs/ajvbox';
import { addSchema, plainJsonSchema } from '#configs/json-schema';
import fastJsonStringify, { Options as FJSOptions } from 'fast-json-stringify';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse, createServer } from 'http';
import { JSONSchema7 } from 'json-schema';
import { ReadonlyDeep } from 'type-fest';

type THttpServerFactory = (
  handler: (req: IncomingMessage, res: ServerResponse) => void,
  _option: FastifyServerOptions,
) => Server;

/**
 * HTTP serverFactory
 */
function httpServerFactory(handler: (req: IncomingMessage, res: ServerResponse) => void): Server {
  const newServer = createServer((req, res) => handler(req, res));
  newServer.keepAliveTimeout = 120 * 100;
  return newServer;
}

export default function optionFactory() {
  const option: FastifyServerOptions & { serverFactory: THttpServerFactory } = {
    ignoreTrailingSlash: true,
    serverFactory: httpServerFactory,
  };

  const server = fastify<Server, IncomingMessage, ServerResponse>({
    ...option,
    schemaController: {
      bucket: (_parentSchemas?: unknown) => {
        return {
          add(schema: JSONSchema7): FastifyInstance<Server, IncomingMessage, ServerResponse> {
            addSchema(schema);
            return server;
          },
          getSchema(schemaId: string) {
            return plainJsonSchema[schemaId];
          },
          getSchemas(): ReadonlyDeep<Record<string, JSONSchema7>> {
            return plainJsonSchema;
          },
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      compilersFactory: {
        buildValidator() {
          return ({ schema }: { schema: any }) => ajv.compile(schema);
        },
        buildSerializer(externalSchemas: FJSOptions['schema'], options?: FJSOptions) {
          return ({ schema }: { schema: any }) => {
            const fjsoption = options ?? {};

            fjsoption.schema = externalSchemas;
            fjsoption.ajv = ajvOptions;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const stringify = fastJsonStringify(schema, fjsoption);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return (data: unknown) => stringify(data);
          };
        },
      } as any,
    },
  });

  return { fastify: server, option };
}
