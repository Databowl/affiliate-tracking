#!/bin/sh

aws s3 cp ./dist/bundles/affiliate-tracking.umd.js s3://${BUCKET_NAME}/${DEPLOY_PATH} --acl public-read
echo "{\"latestVersion\":\"${DEPLOY_PATH}\"}" |  aws s3 cp - s3://${BUCKET_NAME}/${VERSION_FILE} --acl public-read