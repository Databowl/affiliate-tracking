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
    // baseUrl,
    // cookieExpiryInDays,
    // cookiePrefix,
    // cookiePath,
    // documentReferer,
    // ipv4BaseUrl,
    // sitePath,
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

Create an event, you can find the event type IDs in your integration document.

```
trackingClient.getUid(
    eventTypeId: number, // the ID of the event type you want to create
    userDefinedParams: object = {} // you can send custom parameters to be stored on the event
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
