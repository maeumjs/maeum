import IConfiguration from '#configs/interfaces/IConfiguration';
import logging from '#loggers/bootstrap';
import getCwd from '#tools/misc/getCwd';
import fs from 'fs';
import { parse } from 'jsonc-parser';
import path from 'path';

const log = logging(__filename);

export default function readConfigFile(runMode: string): IConfiguration {
  const dirname = path.join(getCwd(process.env), 'resources', 'configs');
  const filename = `config.${runMode}.json`;
  const configBuf = fs.readFileSync(path.join(dirname, filename));
  const parsed = parse(configBuf.toString()) as IConfiguration;

  log.trace('filename: ', filename);

  return parsed;
}
