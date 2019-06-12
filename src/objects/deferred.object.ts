export class Deferred<T> {
    promise: Promise<T>;

    protected promiseResolve: (value?: T | PromiseLike<T>) => void;
    protected promiseReject: (reason?: any) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject  = reject;
        });
    }

    resolve(value?: T | PromiseLike<T>) {
        this.promiseResolve.call(value);
    }

    reject(reason?: any) {
        this.promiseReject.call(reason);
    }
}