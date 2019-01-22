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

var routerStatus;

// chrome.browserAction.setBadgeText({text: 'ON'});
// chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});

// Parse the router results & alert the user if requested
function checkState() {
  // var notification = new Notification('Google Wifi Status Change', { body: 'Offline'});
}

// Intermittently poll the router
function pollRouter() {
  var xhr = new XMLHttpRequest();
  xhr.timeout = 5000; // OnHub is slow...
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        routerStatus = JSON.parse(this.responseText);
        console.log('status updated:', routerStatus);
        checkState();
      } else {
        console.warn(this.statusText);
      }
    }
  };
  xhr.open("GET", "http://testwifi.here/api/v1/status", true);
  xhr.send();
}

// Called on first run/extension update
function setup() {
   console.log('setup');
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
