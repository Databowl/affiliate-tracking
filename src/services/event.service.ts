import {HttpHelper} from "../helpers/http.helper";
import {OptionsObject} from "../options.object";

export class EventService {
    constructor(
        protected httpHelper: HttpHelper,
        protected options: OptionsObject,
    ) {}

    public async createEvent(eventTypeId: number, uid: string, requestParams: object = {}) {
        const eventResponse = await this.httpHelper.submitHttpPostRequest(
            'event/' + uid + '/' + eventTypeId,
            requestParams,
        );

        this.httpHelper.request('OPTIONS', this.options.ipv4BaseUrl + 'event/capture-ip4/' + eventResponse.data.event);

        return eventResponse;
    }
}
