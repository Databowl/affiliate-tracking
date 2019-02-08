import {defaultCookieExpiryInDays} from "./helpers/cookie.helper";

export class OptionsObject {
    constructor(
        public urlId: string,
        public defaultAffiliateId: string,
        public baseUrl: string = 'https://dbevt.com/',
        public cookieExpiryInDays: number = defaultCookieExpiryInDays,
        public cookiePrefix: string = '',
        public cookiePath: string = '/',
        public documentReferrer: string = document.referrer,
    ) {}
}