#!/bin/sh

aws s3 cp ./dist/bundles/affiliate-tracking.umd.js s3://${BUCKET_NAME}/${DEPLOY_PATH} --acl public-read