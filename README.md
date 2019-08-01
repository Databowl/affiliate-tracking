# Affiliate Tracking

This is the affiliate tracking library that you can include on your sites to track affiliate traffic with Databowl.

## Basic Example

```
var urlId = '10512f4d-87a4-4d8f-810d-f86546bcbec6';
var defaultAffiliateId = '56df5ddc-7c02-4ddb-b9c7-aa7a6821ac33';

var trackingOptions = new DbEvtTracking.OptionsObject(
    urlId,
    defaultAffiliateId
    // baseUrl,
    // cookieExpiryInDays,
    // cookiePrefix,
    // cookiePath,
    // documentReferer,
    // ipv4BaseUrl,
    // sitePath,
);

var trackingClient = new DbEvtTracking.TrackingClient(trackingOptions);

trackingClient.registerPageView();
```

## Installing with NPM

You can easily install this library with [npm](https://www.npmjs.com/):

```
npm install @databowl/affiliate-tracking
```

### Usage

```
import {OptionsObject, TrackingClient} from '@databowl/affiliate-tracking';

const urlId = '10512f4d-87a4-4d8f-810d-f86546bcbec6';
const defaultAffiliateId = '56df5ddc-7c02-4ddb-b9c7-aa7a6821ac33';

const trackingOptions = new OptionsObject(
    urlId,
    defaultAffiliateId
    // recaptchaV3SiteKey,
    // baseUrl,
    // cookieExpiryInDays,
    // cookiePrefix,
    // cookiePath,
    // documentReferer,
    // ipv4BaseUrl,
    // sitePath,
    // recaptchaV2SiteKey
    // recaptchaV3Threshold
);

const trackingClient = new TrackingClient(trackingOptions);

trackingClient.registerPageView();
```

## Options

|Option|Required|Description|Default
|------|--------|-----------|-------
|urlId|Yes|The id of your URL, this can be found in your Databowl integration document|None
|defaultAffiliateId|Yes|The affiliate ID you want to assign to organic traffic|None
|baseUrl|No|Override the URL for the Databowl affiliates service|https://dbevt.com/
|cookieExpiryInDays|No|The number of days before stored cookies will expire|7
|cookiePrefix|No|Assign a prefix to your cookies, useful if you are using this library more than once on the same domain|*empty*
|documentReferrer|No|Set to send Databowl the URI of the page that linked to your page|`document.referrer`
|ipv4BaseUrl|No|Set to override the IPv4 capture URL|https://ipv4.dbevt.com
|sitePath|No|The path to the root of your site (required if you have multiple sites on the same domain)|''
|recpatchaV2SiteKey|No|A key provided by Recaptcha v2 for your site to be able to use bot detection features|
|recaptchaV3SiteKey|No|A key provided by Recaptcha v3 for your site to be able to use bot detection features
|recaptchaV3Threshold|No| The bot detection score under which in active recaptcha, the user will be prompted to verify that they are not a bot. Defaults to 0.1
|eventBlockedRedirectUrl|No| The url to redirect to when an affiliate event is blocked by filter rules|None

You can also set these options individually:

```
trackingOptions.cookieExpiryInDays = 10;
```

## Methods

### Register Page View

If the current referrer shows that this page was not reached from another page within the same domain, this will fire
a click event. Either way, it will also fire a page-view event.

```
trackingClient.registerPageView(
    userDefinedParams: object = {} // you can send custom parameters to be stored on the events
);
```

Response:

```
{
    "success": true or false,
    "data": {
        "id": the user's ID,
        "event": the created event's ID
    }
}
```

### Create Event

Create an event, you can find the event type IDs in your integration document.

```
trackingClient.createEvent(
    eventTypeId: number, // the ID of the event type you want to create
    userDefinedParams: object = {} // you can send custom parameters to be stored on the event
);
```

Response:

```
{
    "success": true or false,
    "data": {
        "id": the user's ID,
        "event": the created event's ID
    }
}
```


### Get the user's Databowl ID

Using an affiliate ID, you can get a unique ID for identifying the user

```
trackingClient.getUid(
    affiliateId: string, // your affiliate's Databowl ID
    subAffiliateId: string|null // optional, your sub-affiliate's ID
);
```

Response:

```
The user's ID
```

### Get the current event parameters

Gets the currently stored event parameters as a key=>value object.

```
trackingClient.getEventParams();
```

Response:

```
{
    "key": value
}
```

### Get a specific event parameter

Gets the currently stored event parameters as a key=>value object.

```
trackingClient.getEventParam(
    key: string, // the key for the parameter value you want to find
    defaultValue: string = null // the default value for non-existant keys
);
```

Response:

```
The value for the specific event parameter key
```

### Set the value for an event parameter

Sets the value for an event parameter.

```
trackingClient.setEventParam(
    key: string, // the key for the parameter value you want to set
    value: string = null // the value to set
);
```

### Add multiple event parameters

Set the values for multiple event parameters.

```
trackingClient.addEventParams(
    params: {[key: string]: string} // a key=>value object containing the data you want to set
);
```

### Active Recaptcha Check
```
var recaptchaElement = document.createElement('div');
document.body.appendChild(recaptchaElement);

trackingClient.activeRecaptchaCheck(
    action: string,
    recaptchaElement: HTMLElement
);
```

This will retrieve a score from Recaptcha v3 that determines how likely the current user is to to be a bot. 
If the user scores below the threshold set in OptionsObject, which has a default value, then the user will be offered 
the chance to complete Recaptcha v2 "I am not a robot". The result of this will be stored on the user in Databowl
 affiliates, and you can configure the campaign to reject bot events.

