/**
 * Demo-only anonymous UI telemetry.
 * Sends event names/counts only. Never reads input values, passwords, cookies, or storage.
 */
(function () {
  'use strict';
  var endpoint = '/api/track';
  function send(eventName) {
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, demo: true }),
      }).catch(function () {});
    } catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', function () {
    send('page_view');
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('button,a') : null;
      if (target) send('ui_click');
    });
  });
  window.TrackingAPI = { track: send, enable: function () {}, disable: function () {} };
})();
