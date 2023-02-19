import escape from '#tools/misc/escape';
import type fastSafeStringify from 'fast-safe-stringify';

export default function escapeSafeStringify<T>(
  data: T,
  stringify?: (
    value: any,
    replacer: Parameters<typeof fastSafeStringify>[1],
    space: Parameters<typeof fastSafeStringify>[2],
  ) => string,
  replacer?: Parameters<typeof fastSafeStringify>[1],
  space?: Parameters<typeof fastSafeStringify>[2],
): string {
  try {
    return stringify != null
      ? escape(stringify(data, replacer, space))
      : escape(JSON.stringify(data, replacer, space));
  } catch {
    return '{}';
  }
}
