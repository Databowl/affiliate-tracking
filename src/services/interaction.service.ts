import BrowserInteractionTime from "browser-interaction-time";

export class InteractionService {
    protected browserInteractionTime: BrowserInteractionTime;

    constructor() {
        this.browserInteractionTime = new BrowserInteractionTime({});
    }

    public getUnloadEventName(): string {
        return this.isBrowserIos() ? "pagehide" : "beforeunload";
    }

    public getInteractionTime(): number {
        return this.browserInteractionTime.getTimeInMilliseconds();
    }

    isBrowserIos(): boolean {
        return navigator.userAgent.match(/iPad/i) !== null ||
            navigator.userAgent.match(/iPhone/i) !== null ||
            navigator.userAgent.match(/iPod/i) !== null;
    }
}
