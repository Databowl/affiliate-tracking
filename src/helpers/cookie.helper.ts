import {OptionsObject} from "../options.object";

export const defaultCookieExpiryInDays = 7;

export class CookieHelper {
    constructor(
        protected options: OptionsObject,
    ) {}

    public setCookie(name: string, value: string) {
        const date = new Date();
        date.setTime(date.getTime() + (this.options.cookieExpiryInDays * 24 * 60 * 60 * 1000));

        let cookieObject: {[key: string]: string} = {};
        cookieObject[this.options.cookiePrefix + name] = value;
        cookieObject['expires'] = date.toUTCString();
        cookieObject['path'] = this.options.cookiePath;

        document.cookie = Object.keys(cookieObject).map((cookieSettingKey: string) => {
            return cookieSettingKey + '=' + cookieObject[cookieSettingKey];
        }).join(';');
    }

    public getCookie(name: string, defaultValue:string = null) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + this.options.cookiePrefix + name + "=");

        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }

        return defaultValue;
    }
}