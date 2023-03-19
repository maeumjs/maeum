import getPort from '#configs/modules/getPort';
import logging from '#loggers/bootstrap';
import envBootstrap from '#server/plugin/environments';
import { bootstrap as httpBootstrap, listen, unbootstrap as httpUnbootstrap } from '#server/server';
import { bootstrap as i18nBootstrap } from '#tools/i18n/i18n';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';

const log = logging(__filename);

export async function bootstrap() {
  await envBootstrap();

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
  } catch (caught) {
    const err = isError(caught, new Error('unknown error raised from application start'));

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
