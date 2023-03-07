import config, { changePort } from '#configs/config';

export default function getPort(): number {
  const envPort = process.env.PORT ?? '';
  const parsed = parseInt(envPort, 10);

  if (!Number.isNaN(parsed)) {
    changePort(parsed);
    return parsed;
  }

  changePort(config.server.port);
  return config.server.port;
}
