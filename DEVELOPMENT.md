# Development

## Config

Copy `environments/environment.example.ts` to `environments/environment.dev.ts` and add values to the keys appropriate 
for your local environment.

## Setup

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
AWS_KEY:                The AWS key used for delpoying the umd bundle
AWS_SECRET:             The AWS secret used for delpoying the umd bundle
BUCKET_NAME:            The bucket that the umd bundle will be deployed to
DEPLOY_PATH:            The path that the umd bundle will be deployed to
DEPLOY_HOST:            The hostname the umd bundle will be deployed to (e.g. https://example.com)
VERSION_FILE:           The path that to the file that stores the last deployed filename
ENVIRONMENT:            The environment to use when building library (defaults to dev)
NPM_PUBLISH_AUTH_TOKEN: The auth token required for publishing to npm
RECAPTCHA_SITE_KEY:     The site key for the recaptcha account
```

## Deploying package to NPM

When a new version of this package is ready to be deployed to NPM create a new tag in the git repository from the 
`master` branch. The new tag version will be used for the NPM package version.

## Creating a test package

Run the following command to create a tarball of this package:

```
npm run build
npm pack
```

You should see a generated file with the name `databowl-affiliate-tracking-0.0.0.tgz`. To use this test package in your
project you can run the following command from your project's directory:

```
npm install @databowl/affiliate-tracking@../affiliate-tracking/databowl-affiliate-tracking-0.0.0.tgz
``` 