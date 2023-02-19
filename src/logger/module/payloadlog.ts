import escapeSafeStringify from '#tools/misc/escapeSafeStringify';
import { snakeCase } from 'change-case';
import fastSafeStringify from 'fast-safe-stringify';

export default function payloadlog(payload: unknown, prefix: string): Record<string, string> {
  try {
    if (payload == null) {
      return {};
    }

    if (typeof payload === 'object' && !Array.isArray(payload)) {
      return Object.entries(payload).reduce((aggregation, [key, value]) => {
        return {
          ...aggregation,
          [`${prefix}_${snakeCase(key)}`]:
            value != null ? escapeSafeStringify(value, fastSafeStringify) : 'value-empty',
        };
      }, {});
    }

    if (typeof payload === 'object' && Array.isArray(payload)) {
      const obj = {
        [`${prefix}_array`]: payload
          .map((element) => escapeSafeStringify(element, fastSafeStringify))
          .join(', '),
      };
      return obj;
    }

    if (
      typeof payload === 'string' ||
      typeof payload === 'number' ||
      typeof payload === 'boolean' ||
      typeof payload === 'symbol' ||
      typeof payload === 'bigint'
    ) {
      return { [`${prefix}_${typeof payload}`]: payload.toString() };
    }

    const unknownObj = {
      [`${prefix}_unknown_type`]: escapeSafeStringify(payload, fastSafeStringify),
    };

    return unknownObj;
  } catch (err) {
    return {};
  }
}
