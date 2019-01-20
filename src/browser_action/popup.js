console.log('0');
document.addEventListener('DOMContentLoaded', function () {
console.log('1');
  chrome.runtime.getBackgroundPage(function (bg) {
    console.log('2');
    var onHubStatus = bg.onHubStatus;
    console.log(onHubStatus);
    console.log('got it');

        document.getElementById("software").innerHTML = onHubStatus.software.softwareVersion;
        document.getElementById("wanip").innerHTML = onHubStatus.wan.localIpAddress;
        document.getElementById("gateway").innerHTML = onHubStatus.wan.gatewayIpAddress;
        document.getElementById("dns").innerHTML = onHubStatus.wan.nameServers;
        document.getElementById("online").innerHTML = onHubStatus.wan.online;
        document.getElementById("uptime").innerHTML = onHubStatus.system.uptime;
}); });
