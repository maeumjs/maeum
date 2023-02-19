import { start } from '#server/app';
import { isError } from 'my-easy-fp';

start().catch((caught) => {
  const err = isError(caught, new Error('unknown error raised'));

  // eslint-disable-next-line no-console
  console.error(err.message);
  // eslint-disable-next-line no-console
  console.error(err.stack);
});
