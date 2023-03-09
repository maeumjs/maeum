const { generateApi } = require('swagger-typescript-api');
const path = require('path');
const fs = require('fs');

const output = path.join(process.cwd(), 'resources', 'apis', 'generated');

if (!fs.existsSync(output)) {
  fs.mkdirSync(output, { recursive: true });
}

generateApi({
  url: 'http://localhost:7878/swagger.io/json',
  httpClientType: 'axios',
  generateClient: true,
  generateRouteTypes: false,
  generateResponses: true,
  toJS: false,
  extractRequestBody: true,
  defaultResponseType: 'any',
  enumNamesAsValues: true,
  modular: true,
  hooks: {
    onParseSchema: (originalSchema, parsedSchema) => {
      if (originalSchema.type === 'json') {
        parsedSchema.content = 'JSON';
      }
      return parsedSchema;
    },
  },
})
  .then(({ files, configuration }) => {
    files.forEach(({ content, name }) => {
      const fileContent = name === 'http-client.ts' ? `// @ts-nocheck \n${content}` : content;

      fs.writeFile(`${output}/${name}`, fileContent, (err, result) => {
        if (err) console.log('error', err);
        else {
          console.log(`✅ ${name} generated!`);
        }
      });
    });
  })
  .catch((e) => console.error(e));
