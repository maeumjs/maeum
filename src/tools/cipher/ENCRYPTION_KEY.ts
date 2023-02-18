import { populate } from 'my-easy-fp';

const ENCRYPTION_KEY =
  process.env.ENV_MAEUM_CODE_ENC_KEY ??
  populate(7)
    .map(() => 'maeum')
    .join('')
    .slice(0, 32);

export default ENCRYPTION_KEY;
