const fs = require('fs');
const path = require("path");

const libraryFilePath = path.resolve(__dirname, '../../dist/bundles/affiliate-tracking.umd.js');
const librarySource = fs.readFileSync(libraryFilePath, 'utf8');

exports.createNewPage = async (options) => {
    let url = 'https://example.com';

    if (options && options.hasOwnProperty('queryParams')) {
        const queryString = Object.keys(options.queryParams)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options.queryParams[k])}`)
        .join('&');

        url += '?' + queryString;
    }

    const page = await newPage();

    const gotoParams = {
        waitUntil: 'networkidle0'
    };

    await page.goto(url, gotoParams);
    await page.addScriptTag({content: librarySource});

    await page.evaluate(`(async () => {
        window.trackingOptions = new DbEvtTracking.OptionsObject('urlId', 'defaultAffiliateId');
    })()`);

    if (options && options.hasOwnProperty('referer')) {
        await page.evaluate(`(async () => {
            window.trackingOptions.documentReferrer = '${options.referer}';
        })()`);
    }

    await page.evaluate(`(async () => {
        window.trackingClient = new DbEvtTracking.TrackingClient(trackingOptions);
    })()`);

    return page;
};