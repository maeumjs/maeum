import { FastifyDynamicSwaggerOptions, JSONObject } from '@fastify/swagger';

function getReferenceId(json: JSONObject, index: number): string {
  try {
    if (typeof json.$id === 'string') {
      return json.$id;
    }

    return `def-${index}`;
  } catch {
    return `def-${index}`;
  }
}

/** swagger configuration */
export default function swaggerConfig(): FastifyDynamicSwaggerOptions {
  return {
    openapi: {
      info: {
        title: 'Maeum boilerplate',
        description: 'Maeum boilerplate Swagger Document',
        version: '0.2.0',
      },
    },
    refResolver: {
      buildLocalReference(json, _baseUri, _fragment, i) {
        if (json.title == null && json.$id != null) {
          // eslint-disable-next-line no-param-reassign
          json.title = json.$id;
        }

        return getReferenceId(json, i);
      },
    },
  };
}
