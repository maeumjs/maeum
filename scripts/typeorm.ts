import { bootstrap as configBootstrap } from '#configs/config';
import getRunMode from '#configs/modules/getRunMode';
import { config as dotenvConfig } from 'dotenv';
import { isError } from 'my-easy-fp';
import path from 'path';

dotenvConfig({
  path: path.join(
    process.cwd(),
    'src',
    'config',
    'files',
    `config.${getRunMode(process.env.RUN_MODE ?? 'local')}.env`,
  ),
});

configBootstrap().catch((caught) => {
  const err = isError(caught, new Error('unknown error raised'));

  console.log(err.message);
  console.log(err.stack);
});
