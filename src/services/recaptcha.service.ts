import { load } from 'recaptcha-v3';
import {OptionsObject} from "../options.object";

import environment from "../../environments/environment";
import {HttpHelper} from "../helpers/http.helper";
import {url} from "inspector";
import {Deferred} from "../objects/deferred.object";

export class RecaptchaService {
    constructor(
        protected options: OptionsObject,
        protected httpHelper: HttpHelper,
    ) {
        const element = document.createElement('script');
        element.setAttribute('type', 'text/javascript');
        element.setAttribute('src', 'https://www.google.com/recaptcha/api.js?render=' + options.recaptchaV3SiteKey);
        document.getElementsByTagName("head")[0].appendChild(element);
    }

    public async getToken(action: string): Promise<string> {
        try {
            action = action.replace('-', '');

            const recaptcha = await load(this.options.recaptchaV3SiteKey);
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

    public async getV2Token(action: string, recaptchaElement: HTMLElement): Promise<string> {
        let recaptchaDeferred = new Deferred<string>();

        // unfortunately using @types/grecaptcha doesn't work because it conflicts with recaptcha-v3
        let recaptchaV2: any = grecaptcha;

        recaptchaV2.render(recaptchaElement, {
            'sitekey' : this.options.recaptchaV2SiteKey,
            'theme' : 'light',
            'callback': recaptchaDeferred.resolve,
        });

        return await recaptchaDeferred.promise;
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

    public async activeRecaptchaCheck(action: string, recaptchaElement: HTMLElement, urlId: string) : Promise<void> {
        let v3Result = 0.0;
        for(let v3Attempts = 0; v3Attempts < 3;) {
            try {
                v3Result = await this.getScore('formSubmit');
                break;
            } catch (e) {
                console.error(e);
                v3Attempts++;
            }
        }

        if (v3Result <= this.options.recaptchaV3Threshold) {
            let v2Passed = false;
            let numV2Attempts = 0;

            while (!v2Passed && numV2Attempts < 3) {
                let v2Token = await this.getV2Token(action, recaptchaElement);

                v2Passed = await this.getV2Result(v2Token, urlId);
                numV2Attempts++;
            }
        }
    }
}
