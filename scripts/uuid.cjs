const { randomUUID } = require('node:crypto');

const uuid = randomUUID();

console.log('uuid: ', uuid);
console.log('uuid: ', uuid.replace(/-/g, ''));

console.log('uuid: ', uuid.toUpperCase());
console.log('uuid: ', uuid.replace(/-/g, '').toUpperCase());
