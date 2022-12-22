import decrypt from '@tool/cipher/decrypt';
import encrypt from '@tool/cipher/encrypt';
import 'jest';

test('cipher test', () => {
  const e = encrypt('Hi maeum');
  const d = decrypt(e);

  expect(e).toEqual('ed6f1ff77d1f282b5fe2f69c529e9819:dafe8d98ffe0257e2d879b56963e0ecb');
  expect(d).toEqual('Hi maeum');
});
