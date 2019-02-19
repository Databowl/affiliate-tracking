import {HttpHelper} from "../helpers/http.helper";

export class EventService {
    constructor(
        protected httpHelper: HttpHelper,
    ) {}

    public async createEvent(eventTypeId: number, uid: string, requestParams: object = {}) {
        return await this.httpHelper.submitHttpPostRequest(
            'event/' + uid + '/' + eventTypeId,
            requestParams,
        );
    }
}
