import debug from 'debug';
import { basename } from 'path';

const channel = 'maeum';

/**
 * @param channel name of debugging channel
 */
export default function ll(filename: string): debug.IDebugger {
  const debugChannel = process.env.DEBUG;
  if (debugChannel == null || debugChannel === '') {
    const nulllog: any = () => undefined; // eslint-disable-line
    return nulllog; // eslint-disable-line
  }

  return debug(`${channel}:${basename(filename, '.ts')}`);
}
