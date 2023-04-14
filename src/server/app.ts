import getPort from '#configs/modules/getPort';
import logging from '#loggers/bootstrap';
import uncaughtExceptionHandlerBootstrap from '#loggers/module/uncaughtExceptionHandler';
import { bootstrap as httpBootstrap, unbootstrap as httpUnbootstrap, listen } from '#server/server';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';

const log = logging(__filename);

export async function bootstrap() {
  uncaughtExceptionHandlerBootstrap();

  // await Promise.all([]);

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
