import { bootstrap as configBootstrap } from '#configs/config';
import { bootstrap as schemaBootstrap } from '#configs/json-schema';
import getRunMode from '#configs/modules/getRunMode';
import uncaughtExceptionHandlerBootstrap from '#logger/module/uncaughtExceptionHandler';
import getCwd from '#tools/misc/getCwd';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// environments
export default async function bootstrap() {
  uncaughtExceptionHandlerBootstrap();

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
  await schemaBootstrap();

  // Stage 03
  await configBootstrap();
}
