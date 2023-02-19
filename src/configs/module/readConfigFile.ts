import IConfiguration from '#configs/interfaces/IConfiguration';
import logging from '#logger/bootstrap';
import fs from 'fs';
import { parse } from 'jsonc-parser';
import path from 'path';

const log = logging(__filename);

export default function readConfigFile(runMode: string): IConfiguration {
  const dirname = path.join(__dirname, '..', 'files');
  const filename = `config.${runMode}.json`;
  const configBuf = fs.readFileSync(path.join(dirname, filename));
  const parsed = parse(configBuf.toString()) as IConfiguration;

  log.trace('filename: ', filename);

  return parsed;
}
