import { CE_ENCRYPTION_DEFAULT } from '#tools/cipher/CE_ENCRYPTION_DEFAULT';

export default function getKey(key?: string) {
  if (key != null && key.length % CE_ENCRYPTION_DEFAULT.KEY_LENGTH === 0) {
    return Buffer.from(key);
  }

  return CE_ENCRYPTION_DEFAULT.ENCRYPTION_KEY;
}
