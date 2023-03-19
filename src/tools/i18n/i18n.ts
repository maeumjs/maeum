import logging from '#loggers/bootstrap';
import { fallbackLng } from '#tools/i18n/i18nConfig';
import getCwd from '#tools/misc/getCwd';
import acceptLanguage from 'accept-language';
import fs from 'fs';
import { parse } from 'jsonc-parser';
import Polyglot from 'node-polyglot';
import path from 'path';
import { ReadonlyDeep } from 'type-fest';

const log = logging(__filename);

const internalLocales: Record<string, Polyglot | undefined> = {};
const locales: ReadonlyDeep<Record<string, Polyglot | undefined>> = internalLocales;

async function getLocaleResources(localeDirPath: string, locale: string) {
  const namespaces = await fs.promises.readdir(path.join(localeDirPath, locale));

  const localeResource = (
    await Promise.all(
      namespaces.map(async (namespace) => {
        return {
          [path.basename(namespace, path.extname(namespace))]: parse(
            (await fs.promises.readFile(path.join(localeDirPath, locale, namespace))).toString(),
          ) as Record<string, any>,
        };
      }),
    )
  ).reduce<Record<string, any>>((aggregation, namespace) => {
    return { ...aggregation, ...namespace };
  }, {});

  return localeResource;
}

export function getFallbackLanguage() {
  return locales[fallbackLng]!;
}

export async function bootstrap() {
  const localeDirPath = path.join(getCwd(process.env), 'resources', 'locales');

  const supportLocales = await fs.promises.readdir(localeDirPath);

  log.trace('locale dir path: ', localeDirPath);
  log.trace('support language: ', supportLocales);

  acceptLanguage.languages(supportLocales);

  const loadedLocales = (
    await Promise.all(
      supportLocales.map(async (supportLocale) => {
        const locale = await getLocaleResources(localeDirPath, supportLocale);
        return { [supportLocale]: locale };
      }),
    )
  ).reduce<Record<string, any>>((aggregation, locale) => {
    return { ...aggregation, ...locale };
  }, {});

  Object.keys(loadedLocales).forEach((locale) => {
    internalLocales[locale] = new Polyglot({ locale, phrases: loadedLocales[locale] });
  });

  if (internalLocales[fallbackLng] == null) {
    throw new Error(`Cannot found default locale: ${fallbackLng}`);
  }

  return loadedLocales;
}

export default locales;
