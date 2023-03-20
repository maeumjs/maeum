import ajvbox from '#configs/ajvbox';
import IConfiguration from '#configs/interfaces/IConfiguration';
import getRunMode from '#configs/modules/getRunMode';
import readConfigFile from '#configs/modules/readConfigFile';
import logging from '#loggers/bootstrap';
import { isError, isFalse } from 'my-easy-fp';
import { ReadonlyDeep } from 'type-fest';

const log = logging(__filename);

const internalConfig: IConfiguration = {} as any;
const config: ReadonlyDeep<IConfiguration> = internalConfig;

let isPortChange: boolean = false;

export function changePort(port: number) {
  if (isFalse(isPortChange)) {
    internalConfig.server.port = port;
    isPortChange = true;
  } else {
    throw new Error('port can change only once');
  }
}

export function bootstrap() {
  try {
    const runMode = getRunMode();
    const readedConfig: IConfiguration = readConfigFile(runMode);

    const validator = ajvbox.compile({ $ref: 'IConfiguration' });
    const validationResult = validator(readedConfig);

    if (isFalse(validationResult)) {
      throw new Error(
        `Error occured from, configuration file reading, \n${
          validator.errors
            ?.map((error) => `${error.instancePath}:${error.message ?? 'unknown error'}`)
            ?.join('\n') ?? ''
        }`,
      );
    }

    internalConfig.server = readedConfig.server;
    internalConfig.endpoint = readedConfig.endpoint;
  } catch (catched) {
    const err = isError(catched) ?? new Error(`unknown error raised from ${__filename}`);

    log.trace(err.message);
    log.trace(err.stack);

    throw err;
  }
}

export function getConfig(): ReadonlyDeep<IConfiguration> {
  return config;
}

export default config;
