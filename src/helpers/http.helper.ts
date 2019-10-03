import {OptionsObject} from "../options.object";

export class HttpHelper {
    protected userIp: string;
    protected userIpv: number;

    protected userIpReceivedCallback: any = null;

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

    public syncRequest(method: string, url: string, params = {}, headers = {}): boolean {
        headers['Affiliate-Tracking-Version'] = this.options.version;

        let xhr = new XMLHttpRequest();
        xhr.open(method, this.options.baseUrl + url, false);
        xhr.withCredentials = true;

        if (headers) {
            Object.keys(headers).forEach(function (key) {
                xhr.setRequestHeader(key, headers[key]);
            })
        }

        xhr.send(JSON.stringify(params));

        return (xhr.status === 200);
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
                    this.userIp = xhr.getResponseHeader('X-Ip-Address');

                    if (this.userIp && this.userIpReceivedCallback) {
                        this.userIpReceivedCallback(this.userIp);
                    }

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

    public registerUserIpReceivedCallback(callback: any) {
        this.userIpReceivedCallback = callback;
    }
}
