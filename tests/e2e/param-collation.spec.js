const assert = require('assert');
const createNewPage = require('./helpers').createNewPage;

before (async function() {
    this.timeout(5000);
});

after (async function() {
    this.timeout(5000);
});

it ('should use fetch params from referrer query string', async function() {
    const mockUid = 'queryuid';
    const page = await createNewPage({
        referer: 'https://www.google.com?q1=google'
    });

    const result = await page.evaluate('window.trackingClient.getEventParams()');

    assert.strictEqual(result.hasOwnProperty('q1'), true);
    assert.strictEqual(result.q1, 'google');
});

it ('should use fetch params from page url query string', async function() {
    const mockUid = 'queryuid';
    const page = await createNewPage({
        queryParams: {
            p1: 'page'
        }
    });

    const result = await page.evaluate('window.trackingClient.getEventParams()');

    assert.strictEqual(result.hasOwnProperty('p1'), true);
    assert.strictEqual(result.p1, 'page');
});
