import safeStringify from '@tool/misc/safeStringify';
import { snakeCase } from 'change-case';
import { typedkey } from 'my-easy-fp';

export default function payloadlog(payload: Record<string, any>): Record<string, string> {
  try {
    return typedkey(payload)
      .map((key) => ({ key, value: payload[key] }))
      .reduce((aggregation, entry) => {
        return { ...aggregation, [`rppl_${snakeCase(entry.key)}`]: safeStringify(entry.value) };
      }, {});
  } catch (err) {
    return {};
  }
}
