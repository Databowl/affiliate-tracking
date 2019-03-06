import {OptionsObject} from "../options.object";
import environment from "../../environments/environment";

export class HttpHelper {
    constructor(
        protected options: OptionsObject,
    ) {
    }

    public async submitHttpPostRequest(url: string, bodyParams: object): Promise<any> {
        const response = await this.request('POST', environment.affiliatesBaseUrl + url, bodyParams, {
            'Content-Type': 'application/json'
        });

        return JSON.parse(response);
    }

    public async submitHttpOptionsRequest(url: string): Promise<any> {
        return await this.request('OPTIONS', environment.affiliatesBaseUrl + url);
    }

    public async request(method: string, url: string, params = {}, headers = {}): Promise<any> {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: this.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: this.statusText
                });
            };

            if (headers) {
                Object.keys(headers).forEach(function (key) {
                    xhr.setRequestHeader(key, headers[key]);
                })
            }

            xhr.send(JSON.stringify(params));
        });
    }
}
