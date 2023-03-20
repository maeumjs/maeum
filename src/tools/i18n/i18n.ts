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

function getLocaleResources(localeDirPath: string, locale: string) {
  const namespaces = fs.readdirSync(path.join(localeDirPath, locale));
  const resourceMap: Record<string, any> = {};

  for (const namespace of namespaces) {
    const key = path.basename(namespace, path.extname(namespace));
    const value = parse(
      fs.readFileSync(path.join(localeDirPath, locale, namespace)).toString(),
    ) as Record<string, any>;

    resourceMap[key] = { ...value, ...(resourceMap[key] ?? {}) };
  }

  return resourceMap;
}

export function getFallbackLanguage() {
  return locales[fallbackLng]!;
}

export function bootstrap() {
  const localeDirPath = path.join(getCwd(process.env), 'resources', 'locales');

  const supportLocales = fs.readdirSync(localeDirPath);

  log.trace('locale dir path: ', localeDirPath);
  log.trace('support language: ', supportLocales);

  acceptLanguage.languages(supportLocales);
  const localeMap: Record<string, any> = {};

  for (const supportLocale of supportLocales) {
    const locale = getLocaleResources(localeDirPath, supportLocale);
    localeMap[supportLocale] = { ...locale, ...(localeMap[supportLocale] ?? {}) };

    internalLocales[supportLocale] = new Polyglot({
      locale: supportLocale,
      phrases: localeMap[supportLocale],
    });
  }

  if (internalLocales[fallbackLng] == null) {
    throw new Error(`Cannot found default locale: ${fallbackLng}`);
  }

  return localeMap;
}

export default locales;
