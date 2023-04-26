import payloadlog from '#loggers/modules/payloadlog';
import escapeSafeStringify from '#tools/misc/escapeSafeStringify';
import { snakeCase } from 'change-case';
import fastSafeStringify from 'fast-safe-stringify';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as uuid from 'uuid';

export default function httplog(
  req: FastifyRequest,
  reply: FastifyReply,
): {
  duration: number;
  headers: Record<string, string>;
  queries: Record<string, string>;
  params: Record<string, string>;
  body: Record<string, string>;
} {
  try {
    const duration = reply.getResponseTime();
    const headers: Record<string, string> = Object.entries(req.headers).reduce<
      Record<string, string>
    >((obj, [key, value]) => {
      return {
        ...obj,
        [`hp_${snakeCase(key)}`]:
          value != null ? escapeSafeStringify(value) : `value-empty-${uuid.v4().replace(/-/g, '')}`,
      };
    }, {});

    const queries: Record<string, string> = (() => {
      return Object.entries(req.query as Record<string, string | undefined>).reduce<
        Record<string, string>
      >((obj, [key, value]) => {
        return {
          ...obj,
          [`qp_${snakeCase(key)}`]:
            value != null
              ? escapeSafeStringify(value, fastSafeStringify)
              : `value-empty-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const params: Record<string, string> = (() => {
      return Object.entries(req.params as Record<string, string | undefined>).reduce<
        Record<string, string>
      >((obj, [key, value]) => {
        return {
          ...obj,
          [`pp_${snakeCase(key)}`]:
            value != null
              ? escapeSafeStringify(value, fastSafeStringify)
              : `value-empty-${uuid.v4().replace(/-/g, '')}`,
        };
      }, {});
    })();

    const body: Record<string, string> = payloadlog(req.body, 'bp');

    return {
      duration,
      headers,
      queries,
      params,
      body,
    };
  } catch (err) {
    return {
      duration: -1,
      headers: {},
      queries: {},
      params: {},
      body: {},
    };
  }
}
