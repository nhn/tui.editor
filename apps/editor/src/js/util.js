import util from 'tui-code-snippet';

let hostnameSent = false;

/**
 * send host name
 * @ignore
 */
function sendHostName() {
  if (hostnameSent) {
    return;
  }
  hostnameSent = true;

  const trackingID = 'UA-115377265-9';
  const applicationID = 'editor';
  const hitType = 'event';
  const {hostname} = location;

  util.imagePing('https://www.google-analytics.com/collect', {
    v: 1,
    t: hitType,
    tid: trackingID,
    cid: hostname,
    dp: hostname,
    dh: applicationID
  });
}

const isMac = /Mac/.test(navigator.platform);

module.exports = {
  sendHostName,
  isMac
};
