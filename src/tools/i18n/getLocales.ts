import i18n, { getFallbackLanguage } from '#tools/i18n/i18n';
import acceptLanguage from 'accept-language';
import { toArray } from 'my-easy-fp';
import Polyglot from 'node-polyglot';

export default function getLocales(languages?: string | string[]): Polyglot {
  try {
    if (languages == null) {
      return getFallbackLanguage();
    }

    const arrayLanguages = toArray(languages);

    if (arrayLanguages.length <= 0) {
      return getFallbackLanguage();
    }

    const [firstLanguage] = arrayLanguages;
    const language = acceptLanguage.get(firstLanguage);

    if (language == null) {
      return getFallbackLanguage();
    }

    const expectPolyglot = i18n[language];

    if (expectPolyglot == null) {
      return getFallbackLanguage();
    }

    return expectPolyglot;
  } catch {
    return getFallbackLanguage();
  }
}
