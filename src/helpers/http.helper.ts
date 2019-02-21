import { transport, request } from 'popsicle/dist/universal';

import {OptionsObject} from "../options.object";
import environment from "../../environments/environment";

export class HttpHelper {
    constructor(
        protected options: OptionsObject,
    ) {}

    public async submitHttpPostRequest(url: string, bodyParams: object): Promise<any> {
        const req = request(environment.affiliatesBaseUrl + url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyParams,
        });

        const response = await transport()(req);
        return await response.body.json();
    }

    public async submitHttpOptionsRequest(url: string): Promise<any> {
        const req = request(environment.affiliatesBaseUrl + url, {
            method: 'options',
        });

        return await transport()(req);
    }
}
