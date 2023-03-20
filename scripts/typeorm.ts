import { bootstrap as configBootstrap } from '#configs/config';
import getRunMode from '#configs/modules/getRunMode';
import { config as dotenvConfig } from 'dotenv';
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

configBootstrap();
