import config from '#configs/config';
import routeMap from '#handlers/route-map';
import logging from '#loggers/bootstrap';
import { ILogFormat } from '#loggers/interface/ILogFormat';
import getHttpMethod from '#loggers/module/getHttpMethod';
import httplog from '#loggers/module/httplog';
import payloadlog from '#loggers/module/payloadlog';
import getLocales from '#tools/i18n/getLocales';
import escape from '#tools/misc/escape';
import escapeSafeStringify from '#tools/misc/escapeSafeStringify';
import { RestError } from '@maeum/error-handler';
import fastSafeStringify from 'fast-safe-stringify';
import type { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';
import { createByfastify3 } from 'jin-curlize';
import { isError } from 'my-easy-fp';
import { compress } from 'snappy';

const log = logging(__filename);

const excludeMap = new Map<string, string>([
  ['/health', 'get'],
  ['/', 'get'],
]);

const curlExcludeMap = new Map<string, string>([['/v1/images', 'post']]);

function create(
  req: FastifyRequest,
  route?: { filePath: string; routePath: string; method: string },
): string | undefined {
  try {
    // exclude check
    if (route != null && curlExcludeMap.get(route.routePath) === route.method.toLowerCase()) {
      return undefined;
    }

    // recommand prettify option enable only local run-mode because newline character possible to broken log
    const command =
      config.server.runMode !== 'production'
        ? createByfastify3(req, { prettify: false, uuid: { command: 'uuidgen', paramName: 'tid' } })
        : createByfastify3(req, { prettify: false });

    return command === '' ? undefined : command;
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error(`unknown error raised from ${__filename}`);

    log.trace(err.message);
    log.trace(err.stack);

    return undefined;
  }
}

function getMessage(err?: Error, lang?: string): string | undefined {
  if (err == null) {
    return undefined;
  }

  if (err instanceof RestError && err.polyglot != null) {
    return escape(getLocales(lang).t(err.polyglot.id, err.polyglot.params));
  }

  return err.message;
}

function getPayload(err?: Error): Record<string, string> | undefined {
  if (err == null) {
    return undefined;
  }

  if (err instanceof RestError) {
    return payloadlog(err.data, 'rppl');
  }

  return undefined;
}

async function getReplyPayload(
  payload: unknown,
  options: { payloadLogging: boolean; useSnappy: boolean },
) {
  if (!options.payloadLogging) {
    return undefined;
  }

  if (payload == null) {
    return undefined;
  }

  if (options.useSnappy) {
    const compressed = await compress(fastSafeStringify(payload, undefined, 2));
    return compressed.toString('base64');
  }

  return escapeSafeStringify(payload, fastSafeStringify);
}

export default async function httpLogging(
  req: FastifyRequest,
  reply: FastifyReply,
  options: { payloadLogging: boolean; useSnappy: boolean },
  level?: keyof ReturnType<typeof logging>,
): Promise<Partial<ILogFormat> | boolean> {
  try {
    if (req.getRequestLogging()) {
      log.trace('Already logging http logging');
      return true;
    }

    req.setRequestLogging();

    const route = routeMap.get(req.routerPath)?.get(req.method.toLowerCase());

    if (route == null) {
      return true;
    }

    // exclude check
    if (excludeMap.get(route.routePath) === route.method) {
      return true;
    }

    const err = req.getRequestError();
    const { duration, headers, queries, params, body } = httplog(req, reply);
    const errPayload = getPayload(err);
    const payload = await getReplyPayload(req.getRequestPayload(), options);

    const contents: ILogFormat = {
      status: reply.raw.statusCode,
      req_method: getHttpMethod(req.raw.method),
      duration,
      req_url: req.raw.url ?? '/http/logging/unknown',
      curl_cmd: create(req, route),
      err_msg: err != null ? getMessage(err, req.headers['accept-language']) : undefined,
      err_stk: err != null ? escape(err.stack ?? '') : undefined,
      body: {
        req_http_version: req.raw.httpVersion,
        ...headers,
        ...queries,
        ...params,
        ...body,
        ...(errPayload ?? {}),
        compl_payload: payload,
      },
    };

    if (reply.statusCode >= 400) {
      log.trace(contents);
    }

    if (level == null) {
      log.info(contents);
    } else {
      log[level](contents);
    }

    return true;
  } catch (caught) {
    const catchedError = isError(caught) ?? new Error(`unknown error raised from ${__filename}`);

    const contents: ILogFormat = {
      err: catchedError,
      curl_cmd: create(req),
      req_method: 'SYS',
      req_url: req.raw.url ?? 'error/response/hook',
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    };

    log.error(contents);

    return false;
  }
}
