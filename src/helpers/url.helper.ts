export class UrlHelper {
    public getQueryParameters(urlString: string = null): {[key: string]: string} {
        const url = new URL(urlString);

        const queryParams: {[key: string]: string} = {};

        for (const urlSearchParam of url.searchParams.entries()) {
            queryParams[urlSearchParam[0]] = urlSearchParam[1];
        }

        return queryParams;
    }
}
