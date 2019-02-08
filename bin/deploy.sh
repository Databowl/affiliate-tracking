#!/bin/sh

aws s3 cp ./dist/index.js s3://${BUCKET_NAME}/${DEPLOY_PATH} --acl public-read