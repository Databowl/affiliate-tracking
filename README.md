# Affiliate Tracking

This is the affiliate tracking library that clients can include on their sites.

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