chrome-status-monitor-for-google-wifi
============================

A Chrome Extension to monitor Google Wifi (or OnHub) status, checking for connectivity, uptime, changes in WAN IP, and more.

This polls the status API (generally at http://testwifi.here/api/v1/status) every minute upon startup.

The following changes are detected:
- Loss of internet connection
- Software update available/applied
- Uptime changes
- Link state changes
- WAN IP / DNS changes

Notifications are provided via the Notifications API, and can (soon) be configured in the extension options.

![Wifi Status Screesnhot](screenshots/screenshot-1.png?raw=true "Wifi Status Screesnhot")

## Installation

Install this app from the [Chrome store](https://chrome.google.com/webstore/detail/status-monitor-for-google/amemccpljobdbgofeleoapbbdomodhpp).

## Author
**Nick Semenkovich**

+ https://github.com/semenko/
+ https://nick.semenkovich.com/

## License
Copyright 2019, Nick Semenkovich \<semenko@alum.mit.edu\>.

Released under the MIT License. See LICENSE for details.
