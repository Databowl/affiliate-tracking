import {UrlHelper} from "./helpers/url.helper";
import {HttpHelper} from "./helpers/http.helper";
import {AffiliateParameterEnum} from "./enums/affiliate-parameter.enum";
import {CookieHelper} from "./helpers/cookie.helper";
import {OptionsObject} from "./options.object";
import {EventService} from "./services/event.service";
import {UidService} from "./services/uid.service";
import {AffiliateEventTypeIdEnum} from "./enums/affiliate-event-type-id.enum";

export class TrackingClient {
    protected eventParams: {[key: string]: string};

    constructor(
        protected options: OptionsObject,
        protected cookieHelper: CookieHelper = null,
        protected httpHelper: HttpHelper = null,
        protected urlHelper: UrlHelper = null,
        protected eventService: EventService = null,
        protected uidService: UidService = null,
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
            this.eventService = new EventService(this.httpHelper);
        }

        if (!uidService) {
            this.uidService = new UidService(
                options,
                this.cookieHelper,
                this.httpHelper,
                this.urlHelper,
            );
        }

        this.initialiseEventParams();
    }

    public async createEvent(eventTypeId: number, userDefinedParams: object = {}) {
        try {
            const requestParams = {
                ...this.eventParams,
                ...userDefinedParams
            };

            const uid = await this.getUid();

            return await this.eventService.createEvent(eventTypeId, uid, requestParams);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    public async createRedirectClickEvent(userDefinedParams: object = {}) {
        const uid = this.getEventParam(AffiliateParameterEnum.Uid);

        if (!uid) {
            return;
        }

        return await this.createEvent(AffiliateEventTypeIdEnum.Click, userDefinedParams);
    }

    public async getUid(): Promise<string> {
        try {
            const affiliateId = this.eventParams[AffiliateParameterEnum.AffiliateId] || this.options.defaultAffiliateId;

            return await this.uidService.getUid(affiliateId);
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
}