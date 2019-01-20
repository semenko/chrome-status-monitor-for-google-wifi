// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var onHubStatus;

chrome.browserAction.setBadgeText({text: 'ON'});
chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    onHubStatus = JSON.parse(this.responseText);
    console.log(onHubStatus);
  };
};
xmlhttp.open("GET", "http://testwifi.here/api/v1/status", true);
xmlhttp.send();
