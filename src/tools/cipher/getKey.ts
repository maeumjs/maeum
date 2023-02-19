import ENCRYPTION_KEY from '#tools/cipher/ENCRYPTION_KEY';
import IV_LENGTH from '#tools/cipher/IV_LENGTH';

export default function getKey(key?: string) {
  const newKey = key ?? ENCRYPTION_KEY;

  if (newKey.length > 32 && newKey.length % IV_LENGTH === 0) {
    return newKey;
  }

  return ENCRYPTION_KEY;
}