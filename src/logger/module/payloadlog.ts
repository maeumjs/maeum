import { snakeCase } from 'change-case';
import { typedkey } from 'my-easy-fp';
import safeStringify from 'src/tools/misc/safeStringify';

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
