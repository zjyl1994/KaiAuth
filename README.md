# KaiAuth

![KaiAuth icon](img/icons/app_112.png)

KaiAuth is a simple Google Authenticator alternative on KaiOS.

You can find prebuild release in https://github.com/zjyl1994/KaiAuth/releases.

Latest build is https://github.com/zjyl1994/KaiAuth/releases/download/1.0.2/kaiauth.zip. You can install this zip package via OmniSD. It work fine for me.

Scan QR code maybe slow,keep patient and wait a moment,it will auto finish.

For advance user:

Some useful short code:
| Shortcode | Feature |
| ---------- | ------------------------------------------------------- |
| \*\#467678\# | load /sdcard/kaiauth.json as current data               |
| \*\#397678\#  | dump current data to /sdcard/kaiauth.json               |
| \*\#7370\#    | clean KaiAuth localStorage data (will lost all data!!!)|
| \*\#0000\#    | get KaiAuth version                                    |

When you type short code in app, App title will change to word you type.
If you want exit short code mode immediately, you can press center button on navigation key.