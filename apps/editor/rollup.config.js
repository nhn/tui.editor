import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'fs';

function i18nEditorImportPath() {
  return {
    name: 'i18nEditorImportPath',
    transform(code) {
      return code.replace('../editorCore', '@toast-ui/editor');
    },
  };
}

const fileNames = fs.readdirSync('./src/i18n');

export default [
  // editor
  {
    input: 'src/esm/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: false,
    },
    plugins: [typescript(), commonjs(), nodeResolve()],
    external: [/^prosemirror/],
  },
  // viewer
  {
    input: 'src/esm/indexViewer.ts',
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: false,
    },
    plugins: [typescript(), commonjs(), nodeResolve()],
    external: [/^prosemirror/],
  },
  // i18n
  {
    input: fileNames.map((fileName) => `src/i18n/${fileName}`),
    output: {
      dir: 'dist/esm/i18n',
      format: 'es',
      sourcemap: false,
    },
    external: ['@toast-ui/editor'],
    plugins: [typescript(), commonjs(), nodeResolve(), i18nEditorImportPath()],
  },
];
