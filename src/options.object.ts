import {defaultCookieExpiryInDays} from "./helpers/cookie.helper";

import environment from "../environments/environment";

export class OptionsObject {
    public readonly version = '@version@';

    constructor(
        public urlId: string,
        public defaultAffiliateId: string,
        public recaptchaSiteKey: string = environment.recaptchaSiteKey,
        public baseUrl: string = environment.affiliatesBaseUrl,
        public cookieExpiryInDays: number = defaultCookieExpiryInDays,
        public cookiePrefix: string = '',
        public cookiePath: string = '/',
        public documentReferrer: string = document.referrer,
        public ipv4BaseUrl: string = environment.affiliatesIpv4BaseUrl,
        public sitePath: string = '',
    ) {}
}