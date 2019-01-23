"use strict";

function manualStatusCheck() {
  chrome.runtime.getBackgroundPage(function (bg) { bg.pollRouter(); });
};

// Set each element of an identical ID to the status results.
// This is a silly/dangerous recursive function which could explode if the status JSON ever changes or has internal references.
// Ignores parent key names (child collisions will be silently ignored).
// TODO: Make this less sketchy?
function setIDsByObject(obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i) && typeof obj[i] == "object" && obj[i] !== null) {
      setIDsByObject(obj[i]);
    } else {
      console.log(i);
      try {
        document.getElementById(i).innerHTML = obj[i];
      } catch (err) {
        console.log ('error on: ', i);
      }
    }
  }
}

function refreshHTML(routerStatus) {
    setIDsByObject(routerStatus);

      // Via https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
      var seconds = parseInt(document.getElementById('uptime').innerHTML, 10);

      if (!isNaN(seconds)) {
        var days = Math.floor(seconds / (3600*24));
        seconds  -= days*3600*24;
        var hrs   = Math.floor(seconds / 3600);
        seconds  -= hrs*3600;
        var mnts = Math.floor(seconds / 60);
        seconds  -= mnts*60;
        document.getElementById('uptimeString').innerHTML = days+"d "+hrs+"h:"+mnts+"m:"+seconds+"s";
      }
}


document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function (bg) {
    console.log(bg.routerStatus);
    refreshHTML(bg.routerStatus);
  });
});
