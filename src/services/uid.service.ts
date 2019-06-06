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
        const uidMapKey = this.options.urlId + '|' + affiliateId;

        if (!this.uidPromiseMap.hasOwnProperty(uidMapKey)) {
            this.uidPromiseMap[uidMapKey] = this.requestNewUid(affiliateId);
        }

        return await this.uidPromiseMap[uidMapKey];
    }

    protected async requestNewUid(affiliateId: string) {
        const requestParams = {
            urlId: this.options.urlId,
        };

        requestParams[AffiliateParameterEnum.AffiliateId] = affiliateId;

        const response = await this.httpHelper.submitHttpPostRequest(
            'api/consumer-session',
            requestParams,
        );

        return response['data']['id'];
    }
}
