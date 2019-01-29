// Derived from https://github.com/beaufortfrancois/extensions-update-notifier-chrome-extension
"use strict";

var alertNetwork = document.querySelector('#alertNetwork');
var alertWANIP = document.querySelector('#alertWANIP');
var alertNameserver = document.querySelector('#alertNameserver');
var alertUptime = document.querySelector('#alertUptime');
var alertFirmware = document.querySelector('#alertFirmware');
var alertLink = document.querySelector('#alertLink');

// Saves synced options.
function saveOptions() {
  console.log('saving');
  chrome.storage.sync.set({
    alertNetwork: alertNetwork.checked,
    alertWANIP: alertWANIP.checked,
    alertNameserver: alertNameserver.checked,
    alertUptime: alertUptime.checked,
    alertFirmware: alertFirmware.checked,
    alertLink: alertLink.checked,
  });
}

// Restores synced preferences.
window.onload = function() {
  chrome.runtime.getBackgroundPage(function (bg) {
    var DEFAULT_OPTIONS = bg.DEFAULT_OPTIONS;
    chrome.storage.sync.get(DEFAULT_OPTIONS, function(results) {
      alertNetwork.checked = results.alertNetwork;
      alertWANIP.checked = results.alertWANIP;
      alertNameserver.checked = results.alertNameserver;
      alertUptime.checked = results.alertUptime;
      alertFirmware.checked = results.alertFirmware;
      alertLink.checked = results.alertLink;
    });
  });
  alertNetwork.onchange = saveOptions;
  alertWANIP.onchange = saveOptions;
  alertNameserver.onchange = saveOptions;
  alertUptime.onchange = saveOptions;
  alertFirmware.onchange = saveOptions;
  alertLink.onchange = saveOptions;
}
