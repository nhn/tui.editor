/* eslint-disable no-unused-vars */
const chartContent = [
  '```chart',
  ',category1,category2',
  'Jan,21,23',
  'Feb,31,17',
  '',
  'type: column',
  'title: Monthly Revenue',
  'x.title: Amount',
  'y.title: Month',
  'y.min: 1',
  'y.max: 40',
  'y.suffix: $',
  '```'
].join('\n');

const codeContent = [
  '```js',
  `console.log('foo')`,
  '```',
  '```javascript',
  `console.log('bar')`,
  '```',
  '```html',
  '<div id="editor"><span>baz</span></div>',
  '```',
  '```wrong',
  '[1 2 3]',
  '```',
  '```clojure',
  '[1 2 3]',
  '```'
].join('\n');

const tableContent = ['| @cols=2:merged |', '| --- | --- |', '| table | table2 |'].join('\n');

const umlContent = [
  '```uml',
  'partition Conductor {',
  '  (*) --> "Climbs on Platform"',
  '  --> === S1 ===',
  '  --> Bows',
  '}',
  '',
  'partition Audience #LightSkyBlue {',
  '  === S1 === --> Applauds',
  '}',
  '',
  'partition Conductor {',
  '  Bows --> === S2 ===',
  '  --> WavesArmes',
  '  Applauds --> === S2 ===',
  '}',
  '',
  'partition Orchestra #CCCCEE {',
  '  WavesArmes --> Introduction',
  '  --> "Play music"',
  '}',
  '```'
].join('\n');

const allPluginsContent = [chartContent, codeContent, tableContent, umlContent].join('\n');
