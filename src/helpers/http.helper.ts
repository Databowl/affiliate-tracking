import {OptionsObject} from "../options.object";

export class HttpHelper {
    protected userIpv: number;

    constructor(
        protected options: OptionsObject,
    ) {
    }

    public async submitHttpPostRequest(url: string, bodyParams: object): Promise<any> {
        const response = await this.request('POST', this.options.baseUrl + url, bodyParams, {
            'Content-Type': 'application/json'
        });

        return JSON.parse(response);
    }

    public async submitHttpOptionsRequest(url: string): Promise<any> {
        return await this.request('OPTIONS', this.options.baseUrl + url);
    }

    public async request(method: string, url: string, params = {}, headers = {}): Promise<any> {
        headers['Affiliate-Tracking-Version'] = this.options.version;

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    this.userIpv = parseInt(xhr.getResponseHeader('IPV'), 10);
                    resolve(xhr.response);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
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

    public getUserIpv(): number {
        return this.userIpv;
    }

}
