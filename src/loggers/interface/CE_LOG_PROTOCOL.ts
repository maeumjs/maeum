export const CE_LOG_PROTOCOL = {
  HTTP: 'http://',
  HTTPS: 'https://',
  MYSQL: 'mysql://',
  RABBITMQ: 'rabbitmq://',
  FASTIFY: 'fastify://',
} as const;

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-redeclare */
export type CE_LOG_PROTOCOL = (typeof CE_LOG_PROTOCOL)[keyof typeof CE_LOG_PROTOCOL];
