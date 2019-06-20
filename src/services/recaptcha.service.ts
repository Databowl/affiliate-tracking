import { load } from 'recaptcha-v3';
import {OptionsObject} from "../options.object";

import environment from "../../environments/environment";

export class RecaptchaService {
    constructor(
        protected options: OptionsObject,
    ) {}

    public async getToken(action: string): Promise<string> {
        try {
            action = action.replace('-', '');

            const recaptcha = await load(environment.recaptchaSiteKey);
            return await recaptcha.execute(action);
        } catch (err) {
            return null;
        }
    }
}
