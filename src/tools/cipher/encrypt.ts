import ENCRYPTION_KEY from '#tools/cipher/ENCRYPTION_KEY';
import IV_LENGTH from '#tools/cipher/IV_LENGTH';
import * as crypto from 'crypto';

export default function encrypt(text: string, key?: string) {
  const iv = crypto.randomBytes(key != null && key.length % 16 === 0 ? key.length : IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = cipher.update(text);

  return `${iv.toString('hex')}:${Buffer.concat([encrypted, cipher.final()]).toString('hex')}`;
}
