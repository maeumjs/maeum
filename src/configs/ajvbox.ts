import Ajv, { Options } from 'ajv';
import ajvFormat from 'ajv-formats';

export const ajvOptions: Options = {
  coerceTypes: 'array',
  keywords: ['collectionFormat', 'example', 'binary'],
  formats: {
    binary: { type: 'string', validate: () => true },
    byte: { type: 'string', validate: () => true },
  },
};

const ajv = new Ajv(ajvOptions);

ajvFormat(ajv);

export default ajv;
