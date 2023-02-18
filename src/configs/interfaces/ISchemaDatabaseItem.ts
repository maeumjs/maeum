import { JSONSchema7 } from 'json-schema';

export default interface ISchemaDatabaseItem {
  id: string;
  filePath: string;
  import: {
    name: string;
    from: [];
  };
  export: {
    name: string;
    to: [];
  };
  dto: boolean;
  schema: JSONSchema7;
  rawSchema: string;
}
