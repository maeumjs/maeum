import decrypt from '#tools/cipher/decrypt';
import encrypt from '#tools/cipher/encrypt';
import 'jest';

test('cipher test', () => {
  const e = encrypt('Hi maeum');
  const d = decrypt(e);

  expect(e).toEqual('4142434445464748494a2d4d4145554d:ded9e6530a10172a1eef4b66b6e512b9');
  expect(d).toEqual('Hi maeum');
});
