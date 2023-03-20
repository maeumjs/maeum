import ajvbox from '#configs/ajvbox';
import ISchemaDatabaseItem from '#configs/interfaces/ISchemaDatabaseItem';
import readJsonSchemaFile from '#configs/modules/readJsonSchemaFile';
import logging from '#loggers/bootstrap';
import { JSONSchema7 } from 'json-schema';
import { isError } from 'my-easy-fp';
import { ReadonlyDeep } from 'type-fest';

const log = logging(__filename);

const internalJsonSchema: Record<string, ISchemaDatabaseItem> = {};
const jsonSchema: ReadonlyDeep<Record<string, ISchemaDatabaseItem>> = internalJsonSchema;

const internalPlainJsonSchema: Record<string, JSONSchema7> = {};
export const plainJsonSchema: ReadonlyDeep<Record<string, JSONSchema7>> = internalPlainJsonSchema;

export function bootstrap() {
  try {
    const readedSchemas: Record<string, ISchemaDatabaseItem> = readJsonSchemaFile();

    Object.entries(readedSchemas)
      .map(([key, value]) => ({ key, value }))
      .forEach((entry) => {
        internalJsonSchema[entry.key] = entry.value;
        internalPlainJsonSchema[entry.value.id] = entry.value.schema;
        ajvbox.addSchema({ ...entry.value.schema, $id: entry.value.id });
      });
  } catch (catched) {
    const err = isError(catched) ?? new Error(`unknown error raised from ${__filename}`);

    log.trace(err.message);
    log.trace(err.stack);

    throw err;
  }
}

export function addSchema(schema: JSONSchema7): JSONSchema7 {
  if (schema.$id == null) {
    throw new Error(`$id mandatory value in addschema ${JSON.stringify(schema)}`);
  }

  const record: ISchemaDatabaseItem = {
    id: schema.$id,
    import: { name: schema.$id, from: [] },
    export: { name: schema.$id, to: [] },
    dto: false,
    filePath: `internal-added-${schema.$id}`,
    rawSchema: JSON.stringify(schema),
    schema,
  };

  internalJsonSchema[schema.$id] = record;
  internalPlainJsonSchema[schema.$id] = schema;

  ajvbox.addSchema(schema);

  return schema;
}

export function getSchemas(): ReadonlyDeep<Record<string, ISchemaDatabaseItem>> {
  return jsonSchema;
}

export default jsonSchema;
