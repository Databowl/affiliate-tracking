# Affiliate Tracking

This is the affiliate tracking library that clients can include on their sites.

## Config

Copy `environments/environment.example.ts` to `environments/environment.dev.ts` and add values to the keys.

## Example

```
var urlId = '10512f4d-87a4-4d8f-810d-f86546bcbec6';
var defaultAffiliateId = '56df5ddc-7c02-4ddb-b9c7-aa7a6821ac33';

var trackingOptions = new DbEvtTracking.OptionsObject(
    urlId,
    defaultAffiliateId
);

var trackingClient = new DbEvtTracking.TrackingClient(trackingOptions);

trackingClient.createRedirectClickEvent();
```

## Development

Install dependencies with:

```
npm install
```

To build the library locally run:

```
npm run build
```

If you want to deploy your changes to a public URL for testing purposes run:

```
BUCKET_NAME=my-bucket DEPLOY_PATH=affiliate-tracking/dbevt-tracking.js ./bin/deploy.sh
```

To run tests:

```
npm run test:e2e
```

## Testing locally in your browser

The easiest way to test your local code in your browser is to right-click your html file in PhpStorm and choose "Open in Browser".

## Production Build Environment Variables

```
AWS_KEY:            The AWS key used for delpoying the umd bundle
AWS_SECRET:         The AWS secret used for delpoying the umd bundle
BUCKET_NAME:        The bucket that the umd bundle will be deployed to
DEPLOY_PATH:        The path that the umd bundle will be deployed to
ENVIRONMENT:        The environment to use when building library (defaults to dev)
RECAPTCHA_SITE_KEY: The site key for the recaptcha account
```
