import type ISchemaDatabaseItem from '#configs/interfaces/ISchemaDatabaseItem';
import logging from '#logger/bootstrap';
import fs from 'fs';
import { parse } from 'jsonc-parser';
import path from 'path';

const log = logging(__filename);

export default function readJsonSchemaFile(): Record<string, ISchemaDatabaseItem> {
  const dirname = path.join(__dirname, '..', 'files');
  const filename = 'store.json';
  const jsonSchemaBuf = fs.readFileSync(path.join(dirname, filename));
  const parsed = parse(jsonSchemaBuf.toString()) as Record<string, ISchemaDatabaseItem>;

  log.trace('filename: ', filename);

  return parsed;
}
