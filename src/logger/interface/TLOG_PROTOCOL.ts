/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-redeclare */
export const TLOG_PROTOCOL = {
  HTTP: 'http://',
  HTTPS: 'https://',
  MYSQL: 'mysql://',
  RABBITMQ: 'rabbitmq://',
  FASTIFY: 'fastify://',
} as const;

export type TLOG_PROTOCOL = typeof TLOG_PROTOCOL[keyof typeof TLOG_PROTOCOL];
