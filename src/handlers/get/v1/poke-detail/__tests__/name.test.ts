import loader from '#configs/loader';
import logging from '#loggers/bootstrap';
import { bootstrap, unbootstrap } from '#server/app';
import { FastifyInstance } from 'fastify';
import 'jest';
import urlna from 'url-naong';
import * as uuid from 'uuid';

const share: { app: FastifyInstance } = {} as any;
const log = logging(__filename);

beforeAll(async () => {
  loader();
  share.app = await bootstrap();
  await share.app.ready();
  share.app.swagger();
});

test('pokemon detail test', async () => {
  const res = await share.app.inject({
    method: 'GET',
    url: urlna('', '/v1/poke-detail/:name', { name: 'pikachu', tid: uuid.v4() }),
  });

  log.trace(res.body);
});

afterAll(async () => {
  await unbootstrap();
});
