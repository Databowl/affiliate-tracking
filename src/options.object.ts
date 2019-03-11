import {defaultCookieExpiryInDays} from "./helpers/cookie.helper";

import environment from "../environments/environment";

export class OptionsObject {
    constructor(
        public urlId: string,
        public defaultAffiliateId: string,
        public baseUrl: string = environment.affiliatesBaseUrl,
        public cookieExpiryInDays: number = defaultCookieExpiryInDays,
        public cookiePrefix: string = '',
        public cookiePath: string = '/',
        public documentReferrer: string = document.referrer,
    ) {}
}