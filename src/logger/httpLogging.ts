import config from '#configs/config';
import logging from '#logger/bootstrap';
import { ILogFormat } from '#logger/interface/ILogFormat';
import getHttpMethod from '#logger/module/getHttpMethod';
import httplog from '#logger/module/httplog';
import payloadlog from '#logger/module/payloadlog';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatusCodes from 'http-status-codes';
import { createByfastify3 } from 'jin-curlize';
import { isError } from 'my-easy-fp';
import { pathToRegexp } from 'path-to-regexp';
import RestError from 'src/modules/http/RestError';
import escape from 'src/tools/misc/escape';

const log = logging(__filename);

const cacheNotHit = Symbol('exclude-cache-not-hit');
const caches: Record<string | typeof cacheNotHit, boolean> = { [cacheNotHit]: false };
const excludes = ['/health', '/', '/swagger.io', '/swagger.io/:suburl*'].map((url) =>
  pathToRegexp(url),
);

const cacheCurls: Record<string | typeof cacheNotHit, boolean> = { [cacheNotHit]: false };
const excludeCurls = ['/v1/images'].map((url) => pathToRegexp(url));

function create(req: FastifyRequest): string | undefined {
  try {
    const urlData = req.urlData();

    if (cacheCurls[urlData.path ?? cacheNotHit] === true) {
      return 'n/a';
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

  if (err instanceof RestError) {
    return escape(err.getMessage(lang));
  }

  return err.message;
}

function getPayload(err?: Error): Record<string, string> | undefined {
  if (err == null) {
    return undefined;
  }

  if (err instanceof RestError) {
    return payloadlog(err.payload);
  }

  return undefined;
}

export default function httpLogging(
  req: FastifyRequest,
  reply: FastifyReply,
  err?: Error,
  level?: keyof ReturnType<typeof logging>,
): Partial<ILogFormat> | boolean {
  try {
    if (req.getIsRequestLogging()) {
      log.trace('Already logging http logging');
      return true;
    }

    req.setRequestLogging();

    const urlData = req.urlData();
    const rawUrl = urlData.path ?? cacheNotHit;

    // check urlData.path in exclude urls
    if (caches[rawUrl] == null) {
      caches[rawUrl] = excludes.some((matcher) => matcher.test(urlData.path ?? '<>'));
    }

    if (caches[rawUrl] !== false) {
      return true;
    }

    // check urlData.path in exclude curl command
    if (cacheCurls[rawUrl] == null) {
      cacheCurls[rawUrl] = excludeCurls.some((matcher) => matcher.test(urlData.path ?? '<>'));
    }

    const { duration, headers, queries, params, body } = httplog(req, reply);
    const payload = getPayload(err);

    const contents: ILogFormat = {
      status: reply.raw.statusCode,
      req_method: getHttpMethod(req.raw.method),
      duration,
      req_url: req.raw.url ?? '/http/logging/unknown',
      curl_cmd: create(req),
      err_msg: err != null ? getMessage(err, req.headers['accept-language']) : undefined,
      err_stk: err != null ? escape(err.stack ?? '') : undefined,
      body: {
        req_http_version: req.raw.httpVersion,
        ...headers,
        ...queries,
        ...params,
        ...body,
        ...(payload ?? {}),
      },
    };

    if (reply.statusCode >= 400) {
      log.trace(contents);
    }

    if (level === undefined || level === null) {
      log.info(contents);
    } else {
      log[level](contents);
    }

    return true;
  } catch (catched) {
    const catchedError = isError(catched) ?? new Error(`unknown error raised from ${__filename}`);

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
