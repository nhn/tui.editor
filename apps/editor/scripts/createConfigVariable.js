const fs = require('fs');
const path = require('path');
const config = require(path.resolve(process.cwd(), '../apps/editor/tuidoc.config.json'));
const examples = config.examples || {};
const { filePath, globalErrorLogVariable } = examples;

/**
 * Get Examples Url
 */
function getTestUrls() {
  if (!filePath) {
    throw Error('not exist examples path at tuidoc.config.json');
  }

  const urlPrefix = 'http://nhn.github.io/tui.editor/latest';

  const testUrls = fs.readdirSync(filePath).reduce((urls, fileName) => {
    if (/html$/.test(fileName)) {
      urls.push(`${urlPrefix}/${filePath}/${fileName}`);
    }
    return urls;
  }, []);

  fs.writeFileSync('url.txt', testUrls.join(', '));
}

function getGlobalVariable() {
  if (!globalErrorLogVariable) {
    throw Error('not exist examples path at tuidoc.config.json');
  }

  fs.writeFileSync('errorVariable.txt', globalErrorLogVariable);
}

getTestUrls();
getGlobalVariable();
