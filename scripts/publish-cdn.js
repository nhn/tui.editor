/* eslint-disable @typescript-eslint/no-var-requires, no-process-env */
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const pkg = require('../apps/editor/package.json');

const LOCAL_DIST_PATH = path.join(__dirname, '../apps/editor/dist/cdn');
const STORAGE_API_URL = 'https://api-storage.cloud.toast.com/v1';
const IDENTITY_API_URL = 'https://api-identity.infrastructure.cloud.toast.com/v2.0';

const tenantId = process.env.TOAST_CLOUD_TENENTID;
const storageId = process.env.TOAST_CLOUD_STORAGEID;
const username = process.env.TOAST_CLOUD_USERNAME;
const password = process.env.TOAST_CLOUD_PASSWORD;

async function getTOASTCloudContainer(token) {
  const response = await fetch(`${STORAGE_API_URL}/${storageId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': token,
    },
  });
  const container = await response.text();

  return `${container.trim()}/editor`;
}

async function getTOASTCloudToken() {
  const data = {
    auth: {
      tenantId,
      passwordCredentials: {
        username,
        password,
      },
    },
  };

  const response = await fetch(`${IDENTITY_API_URL}/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  return result.access.token.id;
}

function publishToCdn(token, localPath, cdnPath) {
  const files = fs.readdirSync(localPath);

  files.forEach((fileName) => {
    const objectPath = `${cdnPath}/${fileName}`;

    if (fileName.match(/(js|css)$/)) {
      const readStream = fs.createReadStream(`${localPath}/${fileName}`);
      const contentType = /css$/.test(fileName) ? 'text/css' : 'text/javascript';

      fetch(`${STORAGE_API_URL}/${objectPath}`, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'X-Auth-Token': token,
        },
        body: readStream,
      });
    } else {
      publishToCdn(token, `${localPath}/${fileName}`, objectPath);
    }
  });
}

async function publish() {
  const token = await getTOASTCloudToken();
  const container = await getTOASTCloudContainer(token);
  const cdnPath = `${storageId}/${container}`;

  [pkg.version, 'latest'].forEach((dir) => {
    publishToCdn(token, LOCAL_DIST_PATH, `${cdnPath}/${dir}`);
  });
}

publish();
