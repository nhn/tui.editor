import sendHostname from 'tui-code-snippet/request/sendHostname';

export const isMac = /Mac/.test(navigator.platform);

export function sendHostName() {
  sendHostname('editor', 'UA-129966929-1');
}
