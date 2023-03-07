export default function getCwd(_env: NodeJS.ProcessEnv): string {
  // if (env.INIT_CWD != null) {
  //   return env.INIT_CWD;
  // }

  return process.cwd();
}
