import { transport, request } from 'popsicle/dist/universal';

import {OptionsObject} from "../options.object";

export class HttpHelper {
    constructor(
        protected options: OptionsObject,
    ) {}

    public async submitHttpPostRequest(url: string, bodyParams: object): Promise<any> {
        const req = request(this.options.baseUrl + url, {
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
        const req = request(this.options.baseUrl + url, {
            method: 'options',
        });

        return await transport()(req);
    }
}
