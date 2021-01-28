/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const directory = path.resolve(__dirname, '../examples');

const fileName = 'index.html';

const style = `
<style>
.wrapper {
  padding: 60px 50px;
  font-size: 15px;
}
ul {
  padding: 0;
  list-style: none;
  overflow: hidden;
}

li {
  display: inline-block;
  width: 30%;
  overflow: hidden;
  line-height: 2;
}

a {
  color: #555;
  text-decoration: none;
}
</style>
`;

function writeData(dir) {
  let data = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"/>${style}</head>
      <body>
        <div class="wrapper">
          <h1>Examples</h1>
  `;

  data += '<ul>';
  const files = fs.readdirSync(dir);

  files.forEach((item) => {
    const p = `${directory}/${item}`;

    if (fs.statSync(p).isFile()) {
      data += `<li><a href="./${item}">${item}</a></li>`;
    }
  });

  data += '</ul></div></body></html>';

  return data;
}

const data = writeData(directory);

fs.writeFile(`snowpack/examples/${fileName}`, data, 'utf8', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('index.html is created successfully');
  }
});
