import {UrlHelper} from "./helpers/url.helper";
import {HttpHelper} from "./helpers/http.helper";
import {AffiliateParameterEnum} from "./enums/affiliate-parameter.enum";
import {CookieHelper} from "./helpers/cookie.helper";
import {OptionsObject} from "./options.object";
import {EventService} from "./services/event.service";
import {UidService} from "./services/uid.service";
import {AffiliateEventTypeHandleEnum} from './enums/affiliate-event-type-handle.enum';
import {RecaptchaService} from "./services/recaptcha.service";

import environment from '../environments/environment';
import {InteractionService} from "./services/interaction.service";

export class TrackingClient {
    protected eventParams: {[key: string]: string};

    constructor(
        protected options: OptionsObject,
        protected cookieHelper: CookieHelper = null,
        protected httpHelper: HttpHelper = null,
        protected urlHelper: UrlHelper = null,
        protected eventService: EventService = null,
        protected uidService: UidService = null,
        protected recaptchaService: RecaptchaService = null,
        protected interactionService: InteractionService = null,
    ) {
        if (!cookieHelper) {
            this.cookieHelper = new CookieHelper(options);
        }

        if (!httpHelper) {
            this.httpHelper = new HttpHelper(options);
        }

        if (!urlHelper) {
            this.urlHelper = new UrlHelper();
        }

        if (!eventService) {
            this.eventService = new EventService(this.httpHelper, options);
        }

        if (!recaptchaService) {
            this.recaptchaService = new RecaptchaService(options, this.httpHelper);
        }

        if (!uidService) {
            this.uidService = new UidService(
                options,
                this.cookieHelper,
                this.httpHelper,
                this.urlHelper,
            );
        }

        if (!interactionService) {
            this.interactionService = new InteractionService();
        }

        this.setupUnloadCallback();
        this.initialiseEventParams();
    }

    public async createEvent(eventTypeHandle: AffiliateEventTypeHandleEnum, userDefinedParams: object = {}) {
        try {
            const requestParams = {
                ...this.eventParams,
                ...userDefinedParams
            };

            if (environment.recaptchaSiteKey) {
                requestParams[AffiliateParameterEnum.RecaptchaToken] = await this.recaptchaService.getToken("affiliate_event_type_" + eventTypeHandle);
            }

            const uid = await this.getUid();
            if (!uid) {
                return;
            }

            return await this.eventService.createEvent(eventTypeHandle, uid, requestParams);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    public async getRecaptchaV3TokenAndScore(action = 'getScore') {
        let score = 0.0;
        let token = null;

        try {
            token = await this.recaptchaService.getToken(action);
            score = await this.recaptchaService.getScore(token);
        } catch (e) {
            console.error(e);
        }

        return {
            token,
            score,
        };
    }

    /**
     * @deprecated renamed 'registerPageView' to better reflect its functionality
     */
    public async createRedirectClickEvent(userDefinedParams: object = {}): Promise<void> {
        return this.registerPageView(userDefinedParams);
    }

    public async registerPageView(userDefinedParams: object = {}): Promise<void> {
        const promises: Promise<any>[] = [];

        if (!this.referrerIsSameSite()) {
            promises.push(this.createEvent(AffiliateEventTypeHandleEnum.Click, userDefinedParams));
        }

        promises.push(this.createEvent(AffiliateEventTypeHandleEnum.PageView, userDefinedParams));

        await Promise.all(promises);
    }

    public referrerIsSameSite(): boolean {
        const baseUrl = location.protocol + "//" + location.host;
        if (document.referrer.indexOf(baseUrl) !== 0) {
            return false; // Different domain
        }

        const referrerPath = document.referrer.replace(baseUrl, '');
        return (referrerPath.indexOf('/' + this.options.sitePath) === 0);
    }

    public async getUid(): Promise<string> {
        try {
            const paramsUid = this.getUidFromEventParams();
            if (paramsUid) {
                this.cookieHelper.setCookie(this.getUidCookieName(), paramsUid);

                return paramsUid;
            }

            const cookieUid = this.getUidFromCookie();
            if (cookieUid) {
                return cookieUid;
            }

            const affiliateId = this.eventParams[AffiliateParameterEnum.AffiliateId] || this.options.defaultAffiliateId;
            const subAffiliateId = this.eventParams[AffiliateParameterEnum.SubAffiliateId] || null;

            const newUid = await this.uidService.getUid(affiliateId, subAffiliateId);

            this.cookieHelper.setCookie(this.getUidCookieName(), newUid);

            return newUid;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    public getEventParams(): {[key: string]: string} {
        return this.eventParams;
    }

    public getEventParam(key: string, defaultValue: string = null): string {
        if (this.eventParams.hasOwnProperty(key)) {
            return this.eventParams[key];
        }

        return defaultValue;
    }

    public setEventParam(key: string, value: string) {
        this.eventParams[key] = value;
    }

    public addEventParams(params: {[key: string]: string}) {
        this.eventParams = {...this.eventParams, ...params};
    }

    public getOptions(): OptionsObject {
        return this.options;
    }

    initialiseEventParams() {
        const refererUrl = this.options.documentReferrer;
        const refererParams = refererUrl ? this.urlHelper.getQueryParameters(refererUrl) : {};
        const pageParams = this.urlHelper.getQueryParameters(window.location.href);

        this.eventParams = {
            ...refererParams,
            ...pageParams,
        };

        if (document.referrer) {
            this.eventParams[AffiliateParameterEnum.RefererOverride] = document.referrer;
        }
    }

    setupUnloadCallback() {
        const unloadEventName = this.interactionService.getUnloadEventName();

        window.addEventListener(unloadEventName, async () => {
            const timeInMilliseconds = this.interactionService.getInteractionTime();
            const uid = await this.getUid();

            if (!uid) {
                return;
            }

            // in my tests submitting as a post request was too slow (as because of cors, two requests are made)
            return await this.httpHelper.submitHttpOptionsRequest(
                'consumer-session/increment-time/' + uid + '?duration_on_page=' + timeInMilliseconds,
            );
        });
    }

    protected getUidFromEventParams(): string {
        return this.eventParams[AffiliateParameterEnum.Uid];
    }

    protected getUidFromCookie(): string {
        return this.cookieHelper.getCookie(this.getUidCookieName());
    }

    protected getUidCookieName(): string {
        return this.options.urlId + '-uid';
    }
}