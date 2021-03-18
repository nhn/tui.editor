/* eslint-disable @typescript-eslint/no-var-requires */
const { spawn } = require('child_process');
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'type', alias: 't', type: String },
  { name: 'script', alias: 's', type: String, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

const pkgMap = {
  editor: '@toast-ui/editor',
  react: '@toast-ui/react-editor',
  vue: '@toast-ui/vue-editor',
  toastmark: '@toast-ui/toastmark',
  chart: '@toast-ui/editor-plugin-chart',
  color: '@toast-ui/editor-plugin-color-syntax',
  code: '@toast-ui/editor-plugin-code-syntax-highlight',
  table: '@toast-ui/editor-plugin-table-merged-cell',
  uml: '@toast-ui/editor-plugin-uml',
};

let script;
let pkg;

Object.keys(options).forEach((key) => {
  const value = options[key];

  if (key === 'script') {
    script = value;
  }

  if (key === 'type') {
    pkg = pkgMap[value];
  }
});

if (!script) {
  throw new Error(
    `You should choose "lint", "test", "test:types", "serve", "serve:ie", "build" as the type of script`
  );
}

if (!pkg) {
  throw new Error(
    `You should choose "editor", "react", "vue", "toastmark", "chart", "color", "code", "uml", "table"
    as the configuration of type
    `
  );
}

spawn('lerna', ['run', '--stream', '--scope', pkg, script], {
  stdio: 'inherit',
});
