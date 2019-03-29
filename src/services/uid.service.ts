import {HttpHelper} from "../helpers/http.helper";
import {OptionsObject} from "../options.object";
import {AffiliateParameterEnum} from "../enums/affiliate-parameter.enum";
import {CookieHelper} from "../helpers/cookie.helper";
import {UrlHelper} from "../helpers/url.helper";

export class UidService {
    protected uidPromiseMap: {[key: string]: Promise<string>} = {};

    constructor(
        protected options: OptionsObject,
        protected cookieHelper: CookieHelper,
        protected httpHelper: HttpHelper,
        protected urlHelper: UrlHelper,
    ) {}

    public async getUid(affiliateId: string) {
        const paramsUid = this.getUidFromEventParams();
        if (paramsUid) {
            this.cookieHelper.setCookie(this.getCookieName(), paramsUid);
            return paramsUid;
        }

        const cookieUid = this.getUidFromCookie();
        if (cookieUid) {
            return cookieUid;
        }

        const uidMapKey = this.options.urlId + '|' + affiliateId;

        if (!this.uidPromiseMap.hasOwnProperty(uidMapKey)) {
            this.uidPromiseMap[uidMapKey] = this.requestNewUid(affiliateId);
        }

        const newUid = await this.uidPromiseMap[uidMapKey];
        this.cookieHelper.setCookie(this.getCookieName(), newUid);

        return newUid;
    }

    async requestNewUid(affiliateId: string) {
        const requestParams = {
            affId: affiliateId,
            urlId: this.options.urlId,
        };

        const response = await this.httpHelper.submitHttpPostRequest(
            'api/consumer-session',
            requestParams,
        );

        return response['data']['id'];
    }

    getUidFromCookie(): string {
        return this.cookieHelper.getCookie(this.getCookieName());
    }

    getUidFromEventParams(): string {
        const pageParams = this.urlHelper.getQueryParameters(document.location.href);
        return pageParams[AffiliateParameterEnum.Uid];
    }

    getCookieName(): string {
        return this.options.urlId + '-uid';
    }
}
