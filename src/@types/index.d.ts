declare namespace NodeJS {
  // eslint-disable-next-line
  interface ProcessEnv {
    /** RUN_MODE field decide server configuration kind */
    RUN_MODE?: string;

    /** ENV_LOG_LEVEL field decide winston log level */
    ENV_LOG_LEVEL?: string;

    /** ENV_REPLY_LOGGING field decide reply payload logging or not */
    ENV_PAYLOAD_LOGGING?: 'true' | 'false';

    /** ENV_REPLY_COMPRESS field decide logged reply payload compress or not */
    ENV_PAYLOAD_LOG_COMPRESS?: 'true' | 'false';
  }
}
