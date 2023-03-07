import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import readPkg from 'read-pkg';
import { swc } from 'rollup-plugin-swc3';

const pkg = readPkg.sync();

export default [
  {
    input: 'src/listen.ts',
    output: {
      file: 'dist/maeum.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        resolveOnly: (module) => {
          return (
            pkg?.dependencies?.[module] != null &&
            pkg?.devDependencies?.[module] != null &&
            pkg?.peerDependencies?.[module] != null
          );
        },
      }),
      typescript({
        tsconfig: 'tsconfig.prod.json',
        compilerOptions: {
          sourceMap: true,
        },
      }),
      swc(),
    ],
  },
];
