export const CE_ENCRYPTION_DEFAULT = {
  ENCRYPTION_KEY: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-MAEUM',
  ENCRYPTION_IV: 'ABCDEFGHIJ-MAEUM',
  KEY_LENGTH: 32,
  IV_LENGTH: 16,
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/naming-convention
export type CE_ENCRYPTION_DEFAULT =
  (typeof CE_ENCRYPTION_DEFAULT)[keyof typeof CE_ENCRYPTION_DEFAULT];
