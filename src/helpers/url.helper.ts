export class UrlHelper {
    public getQueryParameters(urlString: string = null): { [key: string]: string } {
        const url = new URL(urlString);
        const search: string = url.search.indexOf('?') !== -1 ? url.search.substr(1) : url.search;
        const queryParams: { [key: string]: string } = {};

        if (search.length > 0) {
            let keyValuePairs = url.search.indexOf('?') !== -1 ? search.split('&') : [search];
            for (let element of keyValuePairs) {
                let keyValue = element.split('=');
                let key = decodeURIComponent(keyValue[0]);
                let value = typeof keyValue[1] === 'undefined' ? 'true' : decodeURIComponent(keyValue[1]);
                queryParams[key] = value;
            }
        }

        return queryParams;
    }
}
