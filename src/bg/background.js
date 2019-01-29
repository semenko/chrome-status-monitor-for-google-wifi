/*
Intermtitently poll the OnHub/Google Wifi for status.

Author: Nick Semenkovich <semenko@alum.mit.edu>
License: MIT
*/


// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

"use strict";

var DEFAULT_OPTIONS = {
  alertNetwork: true,
  alertWANIP: true,
  alertNameserver: true,
  alertUptime: true,
  alertFirmware: true,
  alertLink: true
};

var routerStatus;

// Parse the router status & alert the user if requested
// We only trend a few things, but store the entire prior state in localStorage
function updateState(routerStatus) {
  console.log('Router state update');
  chrome.runtime.sendMessage({routerStatus});

  // Were we just connected to a router? (was the XHR successful?)
  var routerFound = localStorage.routerFound || null;

  // The entire JSON object from the router's status API
  var lastState = JSON.parse(localStorage.routerStatus || null);
  localStorage.routerStatus = JSON.stringify(routerStatus);

  if (lastState !== null) {
    chrome.storage.sync.get(DEFAULT_OPTIONS, function(userPref) {
      // Network state change
      if (userPref.alertNetwork) {
        if (!routerFound || (lastState.wan.online != routerStatus.wan.online)) {
          var n = new Notification('Google Wifi/OnHub Status Change', {
            body: `Network state changed: Router connected is ${routerFound} and online status is now ${routerStatus.wan.online}`
          });
        };
      };

      // WAN IP Change
      if (userPref.alertWANIP) {
        if (lastState.wan.gatewayIpAddress != routerStatus.wan.gatewayIpAddress) {
          var n = new Notification('Google Wifi/OnHub Status Change', {
            body: `WAN IP changed: IP is now ${routerStatus.wan.gatewayIpAddress} (from ${lastState.wan.gatewayIpAddress})`
          });
        };
      };

      // Nameservers changed
      if (userPref.alertNameserver) {
        if (lastState.wan.nameServers[0] != routerStatus.wan.nameServers[0]) {
          var n = new Notification('Google Wifi/OnHub Status Change', {
            body: `Primary nameserver changed: Now ${routerStatus.wan.nameServers[0]} (was ${lastState.wan.nameServers[0]})`
          });
        };
      };

      // Rebooted
      if (userPref.alertUptime) {
        if (routerStatus.system.uptime < lastState.system.uptime) {
          var n = new Notification('Google Wifi/OnHub Status Change', {
            body: `Router likely rebooted: Uptime is now ${routerStatus.system.uptime} (from ${lastState.system.uptime})`
          });
        };
      };

      if (userPref.alertFirmware) {
        // Software update available
        // TODO: Figure out how updates actually appear.
        if (lastState.system.updateNewVersion != routerStatus.system.updateNewVersion) {
          var n = new Notification('Google Wifi/OnHub Status Change', {
            body: `New firmware available: ${routerStatus.system.updateNewVersion} (current ${routerStatus.system.softwareVersion})`
          });
        };

        // Software version changed
        if (lastState.system.softwareVersion != routerStatus.system.softwareVersion) {
          var n = new Notification('Google Wifi/OnHub Status Change', {
            body: `Firmware version changed: ${routerStatus.system.softwareVersion} (was ${lastState.system.softwareVersion})`
          });
        };
      };

      // Link state change
      if (userPref.alertLink) {
        if (lastState.system.lan0Link != routerStatus.system.lan0Link) {
          var n = new Notification('Google Wifi/OnHub Status Change', {
            body: `Link state change: lan0Link up is now ${routerStatus.system.lan0Link}`
          });
        };
      };
    });
  };
}

// Intermittently poll the router
function pollRouter() {
  var statusURL = "http://testwifi.here/api/v1/status";
  var xhr = new XMLHttpRequest();
  xhr.timeout = 5000; // OnHub is slow...
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        localStorage.routerFound = true;
        chrome.browserAction.setTitle({title: `Last updated at ${new Date().toLocaleTimeString()}`});
        routerStatus = JSON.parse(this.responseText)
        updateState(routerStatus);
      } else {
        localStorage.routerFound = false;
        chrome.browserAction.setTitle({title: `Errror: Unable to reach Google Wifi/OnHub at: ${statusURL}`});
        console.warn(this.statusText);
      }
    }
  };
  console.log('Background: Polling router.');
  xhr.open("GET", statusURL, true);
  xhr.send();
}

// Called on first run/extension update
function setup() {
  console.log('Initialized');
  // Run every minute
  chrome.alarms.create("pollRouterAlarm", { periodInMinutes: 1 });

  // And let's run once right now!
  pollRouter();
}


// Set some onInstalled listeners to fire, since we're not a persistent background page.
chrome.runtime.onInstalled.addListener(setup);

chrome.alarms.onAlarm.addListener(function(alarm) { pollRouter(); });

// Let's run once at startup, too, since alarm can be finicky.
chrome.runtime.onStartup.addListener(function() { pollRouter(); });
