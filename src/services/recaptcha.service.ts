import { load } from 'recaptcha-v3';
import {OptionsObject} from "../options.object";

import environment from "../../environments/environment";
import {HttpHelper} from "../helpers/http.helper";

export class RecaptchaService {
    constructor(
        protected options: OptionsObject,
        protected httpHelper: HttpHelper,
    ) {}

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
}
