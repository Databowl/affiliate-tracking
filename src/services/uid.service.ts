import {HttpHelper} from "../helpers/http.helper";
import {OptionsObject} from "../options.object";
import {AffiliateParameterEnum} from "../enums/affiliate-parameter.enum";
import {CookieHelper} from "../helpers/cookie.helper";
import {UrlHelper} from "../helpers/url.helper";

export class UidService {
    constructor(
        protected options: OptionsObject,
        protected cookieHelper: CookieHelper,
        protected httpHelper: HttpHelper,
        protected urlHelper: UrlHelper,
    ) {}

    public async getUid(affiliateId: string) {
        const cookieUid = this.getUidFromCookie();
        if (cookieUid) {
            return cookieUid;
        }

        const paramsUid = this.getUidFromEventParams();
        if (paramsUid) {
            this.cookieHelper.setCookie('uid', paramsUid);
            return paramsUid;
        }

        const newUid = await this.requestNewUid(affiliateId);
        this.cookieHelper.setCookie('uid', newUid);

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
        return this.cookieHelper.getCookie('uid');
    }

    getUidFromEventParams(): string {
        const pageParams = this.urlHelper.getQueryParameters(document.location.href);
        return pageParams[AffiliateParameterEnum.Uid];
    }
}
