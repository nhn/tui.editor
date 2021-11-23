import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import banner from 'rollup-plugin-banner';
import * as ts from 'typescript';
import { version, author, license } from './package.json';

function transpile() {
  return {
    name: 'transpile',
    transform(code) {
      const result = ts.transpileModule(code, {
        compilerOptions: {
          target: 'es5',
          module: 'es6',
          importHelpers: true,
        },
      });

      return result.outputText;
    },
  };
}

const bannerText = [
  'TOAST UI Editor : Vue Wrapper',
  `@version ${version} | ${new Date().toDateString()}`,
  `@author ${author}`,
  `@license ${license}`,
].join('\n');

export default [
  {
    input: 'src/index.js',
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: false,
    },
    plugins: [vue({}), commonjs(), nodeResolve(), transpile(), banner(bannerText)],
    external: ['vue', '@toast-ui/editor', '@toast-ui/editor/dist/toastui-editor-viewer'],
  },
];
