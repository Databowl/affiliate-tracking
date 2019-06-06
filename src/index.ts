import 'url-polyfill';
import 'promise-polyfill/src/polyfill';

export {TrackingClient} from "./tracking.client";
export {OptionsObject} from "./options.object";

export {CookieHelper} from "./helpers/cookie.helper";
export {HttpHelper} from "./helpers/http.helper";
export {UrlHelper} from "./helpers/url.helper";

export {EventService} from "./services/event.service";
export {UidService} from "./services/uid.service";

export {AffiliateEventTypeHandleEnum} from './enums/affiliate-event-type-handle.enum';
export {AffiliateParameterEnum} from "./enums/affiliate-parameter.enum";