export const CE_HEADER_KEY = {
  RESPONSE_TIME: 'X-Response-Time',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/naming-convention
export type CE_HEADER_KEY = (typeof CE_HEADER_KEY)[keyof typeof CE_HEADER_KEY];
