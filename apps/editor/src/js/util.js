import $ from 'jquery';

/**
 * send host name
 * @ignore
 */
function sendHostName() {
  const trackingID = 'UA-115377265-2';
  const hitType = 'event';
  const {hostname} = location;

  $.post('https://www.google-analytics.com/collect', {
    v: 1,
    t: hitType,
    tid: trackingID,
    cid: hostname,
    dp: hostname,
    dh: hostname
  });
}

module.exports = {
  sendHostName
};
