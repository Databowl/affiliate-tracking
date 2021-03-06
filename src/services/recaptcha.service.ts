import { load } from 'recaptcha-v3';
import {OptionsObject} from "../options.object";

import environment from "../../environments/environment";
import {HttpHelper} from "../helpers/http.helper";
import {url} from "inspector";
import {Deferred} from "../objects/deferred.object";
import {RecaptchaV3ResultObject} from "./recaptcha-v3-result.object";

export class RecaptchaService {
    protected v2Passed: boolean = false;

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

    public async getV3Result(token: string): Promise<RecaptchaV3ResultObject> {
        const result =  await this.httpHelper.submitHttpPostRequest(
            'rcptch/v3/check',
            {
                token: token,
                url_id: this.options.urlId,
            },
        );

        return new RecaptchaV3ResultObject(
            parseFloat(result['result']),
            result['require_v2_recaptcha'],
        );
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
        let v3Result: RecaptchaV3ResultObject = null;

        for(let v3Attempts = 0; v3Attempts < 3;) {
            try {
                const token = await this.getToken('formSubmit');
                v3Result = await this.getV3Result(token);
                break;
            } catch (e) {
                console.error(e);
                v3Attempts++;
            }
        }

        if (this.v2Passed) {
            return;
        }

        if (v3Result === null || v3Result.requireV2Recaptcha) {
            let v2Passed = false;
            let numV2Attempts = 0;

            while (!this.v2Passed && numV2Attempts < 3) {
                let v2Token = await this.getV2Token(action, recaptchaElement);

                this.v2Passed = await this.getV2Result(v2Token, urlId);
                numV2Attempts++;
            }
        }
    }
}
