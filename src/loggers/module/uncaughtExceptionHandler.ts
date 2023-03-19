import logging from '#loggers/bootstrap';
import escapeSafeStringify from '#tools/misc/escapeSafeStringify';
import httpStatusCodes from 'http-status-codes';

const log = logging(__filename);

export default function bootstrap() {
  process.on('uncaughtException', (err) => {
    log.trace('uncaughtException: ', err.message);
    log.trace('uncaughtException: ', err.stack);

    log.crit({
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      req_method: 'SYS',
      req_url: 'uncaughtException',
      err,
    });
  });

  process.on('unhandledRejection', (reason) => {
    log.trace('unhandledRejection: ', reason);

    const message =
      reason == null ? 'unknown error by [unhandledRejection]' : escapeSafeStringify(reason);

    log.crit({
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      req_method: 'SYS',
      req_url: 'unhandledRejection',
      err: new Error(message),
    });
  });
}
