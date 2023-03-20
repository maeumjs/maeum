import { bootstrap as configBootstrap } from '#configs/config';
import { bootstrap as schemaBootstrap } from '#configs/json-schema';
import getRunMode from '#configs/modules/getRunMode';
import { bootstrap as i18nBootstrap } from '#tools/i18n/i18n';
import getCwd from '#tools/misc/getCwd';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

let loaded = false;

export default function loader() {
  if (loaded) {
    return;
  }

  // Stage 02
  dotenvConfig({
    path: path.join(
      getCwd(process.env),
      'resources',
      'configs',
      `config.${getRunMode(process.env.RUN_MODE ?? 'local')}.env`,
    ),
  });

  // Stage 02
  schemaBootstrap();

  // Stage 03
  configBootstrap();

  i18nBootstrap();

  loaded = true;
}

if (process.env.RUN_ON_TESTCASE !== 'true') {
  loader();
}
