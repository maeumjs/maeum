import config, { bootstrap as configBootstrap, changePort } from '#configs/config';
import { bootstrap as schemaBootstrap } from '#configs/json-schema';
import getRunMode from '#configs/module/getRunMode';
import logging from '#logger/bootstrap';
import uncaughtExceptionHandlerBootstrap from '#logger/module/uncaughtExceptionHandler';
import { bootstrap as httpBootstrap, listen, unbootstrap as httpUnbootstrap } from '#server/server';
import { bootstrap as i18nBootstrap } from '#tools/i18n/i18n';
import { config as dotenvConfig } from 'dotenv';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';
import path from 'path';

const log = logging(__filename);

function getPort(): number {
  const envPort = process.env.PORT ?? '';
  const parsed = parseInt(envPort, 10);

  if (!Number.isNaN(parsed)) {
    changePort(parsed);
    return parsed;
  }

  changePort(config.server.port);
  return config.server.port;
}

export async function bootstrap() {
  uncaughtExceptionHandlerBootstrap();

  // Stage 02
  dotenvConfig({
    path: path.join(
      __dirname,
      '..',
      'config',
      'files',
      `config.${getRunMode(process.env.RUN_MODE ?? 'local')}.env`,
    ),
  });

  // Stage 02
  await schemaBootstrap();

  // Stage 03
  await configBootstrap();

  await Promise.all([i18nBootstrap()]);

  const fastify = await httpBootstrap();
  return fastify;
}

export async function unbootstrap() {
  await httpUnbootstrap();
}

export async function start() {
  try {
    await bootstrap();

    listen(getPort());
  } catch (catched) {
    const err = isError(catched) ?? new Error('unknown error raised from application start');

    log.trace(err.message);
    log.trace(err.stack);

    log.crit({
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      req_method: 'SYS',
      req_url: 'app/bootstrap',
      err_msg: err.message,
      err_stk: err.stack ?? 'stack-track: undefined',
    });
  }
}
