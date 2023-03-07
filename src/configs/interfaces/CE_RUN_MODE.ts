export const CE_RUN_MODE = {
  LOCAL: 'local',
  DEVELOP: 'develop',
  QA: 'qa',
  STAGE: 'stage',
  PRODUCTION: 'production',
} as const;

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-redeclare */
export type CE_RUN_MODE = (typeof CE_RUN_MODE)[keyof typeof CE_RUN_MODE];
