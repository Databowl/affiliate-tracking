import {defaultCookieExpiryInDays} from "./helpers/cookie.helper";

import environment from "../environments/environment";

export class OptionsObject {
    public readonly version = '@version@';

    constructor(
        public urlId: string,
        public defaultAffiliateId: string,
        public recaptchaV3SiteKey: string = environment.recaptchaV3SiteKey,
        public baseUrl: string = environment.affiliatesBaseUrl,
        public cookieExpiryInDays: number = defaultCookieExpiryInDays,
        public cookiePrefix: string = '',
        public cookiePath: string = '/',
        public documentReferrer: string = document.referrer,
        public ipv4BaseUrl: string = environment.affiliatesIpv4BaseUrl,
        public sitePath: string = '',
        public recaptchaV2SiteKey = environment.recaptchaV2SiteKey,
        public recaptchaV3Threshold = environment.recaptchaV3Threshold,
    ) {}
}
