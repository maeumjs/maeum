import getIv from '#tools/cipher/getIv';
import * as crypto from 'crypto';
import getKey from './getKey';

export default function encrypt(text: string) {
  const iv = getIv(process.env.ENV_MAEUM_ENCRYPTION_IV);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    getKey(process.env.ENV_MAEUM_ENCRYPTION_KEY),

    iv,
  );
  const encrypted = cipher.update(text);

  return `${iv.toString('hex')}:${Buffer.concat([encrypted, cipher.final()]).toString('hex')}`;
}
