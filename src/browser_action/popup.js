document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function (bg) {
    var routerStatus = bg.routerStatus;
    console.log('1');
    console.log(routerStatus);

    // Try to set each element of an identical ID to the status results.
    // This is a silly/dangerous recursive function which could explode if the status JSON ever changes or has internal references.
    // Ignores parent key names (child collisions will be silently ignored).
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

    setIDsByObject(routerStatus);

  });
});
