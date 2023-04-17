import { CE_ENCRYPTION_DEFAULT } from '#tools/cipher/CE_ENCRYPTION_DEFAULT';

export default function getIv(key?: string) {
  if (key != null && key.length % CE_ENCRYPTION_DEFAULT.IV_LENGTH === 0) {
    return Buffer.from(key);
  }

  return Buffer.from(CE_ENCRYPTION_DEFAULT.ENCRYPTION_IV);
}
