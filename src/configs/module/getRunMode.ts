import { CE_RUN_MODE } from '#configs/interfaces/CE_RUN_MODE';

/**
 * return validate run-mode
 *
 * @returns CE_RUN_MODE
 */
export default function getRunMode(envRunMode?: string): CE_RUN_MODE {
  const runMode = envRunMode ?? process.env.RUN_MODE ?? 'local';

  if (
    runMode !== 'local' &&
    runMode !== 'develop' &&
    runMode !== 'qa' &&
    runMode !== 'stage' &&
    runMode !== 'production'
  ) {
    throw new Error(`invalid run_mode: ${runMode}`);
  }

  return runMode;
}
