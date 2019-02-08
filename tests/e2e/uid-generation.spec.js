const assert = require('assert');
const createNewPage = require('./helpers').createNewPage;

before (async function() {
    this.timeout(5000);
});

after (async function() {
    this.timeout(5000);
});

// So intercepting network requests doesn't currently work in the latest version of puppeteer, fix should be soon:
// - https://github.com/GoogleChrome/puppeteer/issues/3471
//
// it ('should request new uid when none is stored', async function() {
//     const mockUid = 'uid';
//     const page = await createNewPage();
//     await page.setRequestInterception(true);
//
//     page.on('request', request => {
//         return request.respond({
//             status: 200,
//             contentType: 'application/json',
//             body: JSON.stringify({
//                 data: {
//                     id: mockUid
//                 }
//             })
//         });
//     });
//
//     page.on('requestfailed', request => {
//         console.log(request.url() + ' ' + request.failure().errorText);
//     });
//
//     const result = await page.evaluate(`(async () => {
//         return window.trackingClient.getUid().then(function (uid) {
//             return uid;
//         });
//     })()`);
//
//     assert.strictEqual(result, mockUid);
// }).timeout(5000);

it ('should use stored uid when found in cookie', async function() {
    const mockUid = 'cookieuid';
    const page = await createNewPage({
        referer: 'https://www.google.com?g1=google'
    });

    const location = await page.evaluateHandle('window.location');

    const cookies = [
        {
            name: 'uid',
            domain: location.hostname,
            value: mockUid,
            path: '/',
            expires: -1
        }
    ];

    await page.setCookie(...cookies);

    const result = await page.evaluate(`(async () => {
        return window.trackingClient.getUid().then(function (uid) {
            return uid;
        });
    })()`);

    assert.strictEqual(result, mockUid);
});

it ('should use stored uid when found in query params', async function() {
    const mockUid = 'queryuid';
    const page = await createNewPage({
        queryParams: {
            uid: mockUid
        }
    });

    const location = await page.evaluateHandle('window.location');

    const cookies = [
        {
            name: 'uid',
            domain: location.hostname,
            value: mockUid,
            path: '/',
            expires: -1
        }
    ];

    await page.setCookie(...cookies);

    const result = await page.evaluate(`(async () => {
        return window.trackingClient.getUid().then(function (uid) {
            return uid;
        });
    })()`);

    assert.strictEqual(result, mockUid);
});