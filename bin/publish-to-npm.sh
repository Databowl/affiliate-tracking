#!/bin/sh

echo "//registry.npmjs.org/:_authToken=$NPM_PUBLISH_AUTH_TOKEN" > .npmrc
npm publish --access public