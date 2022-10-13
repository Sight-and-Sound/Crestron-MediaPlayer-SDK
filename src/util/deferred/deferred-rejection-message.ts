import { DeferredRejectionReason } from './deferred-rejection-reason';

export class DeferredRejectionMessage<T> {
    public reason: DeferredRejectionReason;
    public data?: T;

    constructor(reason: DeferredRejectionReason, data?: T) {
        this.reason = reason;
        this.data = data;
    }

    public static timeout<T>(): DeferredRejectionMessage<T> {
        return new DeferredRejectionMessage<T>(DeferredRejectionReason.Timeout);
    }
}
