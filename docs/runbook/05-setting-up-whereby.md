# 5. Setting up Whereby

[Whereby](https://whereby.com/) is one of the two video providers that the
application supports, the other is [Jitsi Meet](https://github.com/jitsi/jitsi-meet/blob/master/doc/README.md). The
difference is that Whereby is a paid solution, whereas Jitsi Meet is free and
open source. From our testing, we've found that Whereby provides a more seamless
experience as it doesn't require the user to download an app and works all
within the browser unlike Jitsi. Consequently, current trusts have opted to use
Whereby as their video provider (although it's possible to switch video
providers on a per trust level).

If you want to use Whereby, you'll need to contact their sales team and get an
account with them. Once you have one set up, you can follow the below to get it
configured for usage in your Heroku apps.

## Adding Whereby environment variables

To configure an application to use Whereby, you'll need to set the following
environment variables:

```
WHEREBY_API_KEY=
WHEREBY_SUBDOMAIN=
```

For each one of these, you'll need to add them to each Heroku app you want to
use Whereby on. To add an environment variable to a Heroku app, see their
documentation on [config vars](https://devcenter.heroku.com/articles/config-vars).

## Whitelisting your domains with Whereby

For a Heroku app to use Whereby, you'll need to whitelist the Heroku app URLs
and your custom domains if you're using one by contacting Whereby.

You can validate your domains are whitelisted by replacing `WHEREBY_SUBDOMAIN`
with your subdomain and running:

```
curl --head https://WHEREBY_SUBDOMAIN.whereby.com?iframeSource=WHEREBY_SUBDOMAIN
```

Then within the `Content-Security-Policy` part of the response, your domains
should be listed.

See [Whereby's developer documentation on whitelisting](https://whereby.dev/#whitelisting)
for more details.

## Whitelisting Whereby domains within your restricted network

If you have restrictions on your network, you must whitelist the following to
allow Whereby to work:

- `.whereby.com`
- `.amplitude.com`
- `.appearin.net`
- `.cloudfront.net`

## Disabling Whereby's interstitial splash screen

We recommend you contact Whereby to disable its interstitial splash screen
before each call for a better user experience. It asks the user if they want to
use their browser or the app which isn't ideal because it breaks the flow of
joining a virtual visit by taking the user out of the service.
