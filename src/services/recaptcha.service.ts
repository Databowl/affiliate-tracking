import { load } from 'recaptcha-v3';
import {OptionsObject} from "../options.object";

import environment from "../../environments/environment";
import {HttpHelper} from "../helpers/http.helper";
import {url} from "inspector";

export class RecaptchaService {
    constructor(
        protected options: OptionsObject,
        protected httpHelper: HttpHelper,
    ) {
        const element = document.createElement('script');
        element.setAttribute('type', 'text/javascript');
        element.setAttribute('src', 'https://www.google.com/recaptcha/api.js?render=' + options.recaptchaSiteKey);
        document.getElementsByTagName("head")[0].appendChild(element);
    }

    public async getToken(action: string): Promise<string> {
        try {
            action = action.replace('-', '');

            const recaptcha = await load(this.options.recaptchaSiteKey);
            return await recaptcha.execute(action);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    public async getScore(token: string) {
        const result =  await this.httpHelper.submitHttpPostRequest(
            'rcptch/v3/check',
            {
                token
            },
        );

        return parseFloat(result['result']);
    }

    public async getV2Result(token, urlId): Promise<boolean> {
        const result = await this.httpHelper.submitHttpPostRequest(
            urlId + '/rcptch/v2/check',
            {
                token
            },
        );

        return result['result'];
    }
}
