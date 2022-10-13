/**
 * T = Resolve type
 * E = Reject data type
 */
import { DeferredRejectionMessage } from './deferred-rejection-message';
import { DeferredRejectionReason } from './deferred-rejection-reason';

export class TemporaryDeferred<T, E>
{
    private readonly _timeout: any;
    private _originalReject!: (error: DeferredRejectionMessage<E>) => void;

    public resolve!: (data: T) => void;
    public reject!: (error: E) => void;
    public promise: Promise<T>;

    constructor(private _timeoutMs: number, private _onTimeout: () => void)
    {
        this._timeout = setTimeout(() => {
            this._onTimeout();
            this._originalReject(DeferredRejectionMessage.timeout<E>());
        }, _timeoutMs);

        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;

            this._originalReject = reject;
            this.reject = (data: E) => {
                clearTimeout(this._timeout);
                this._originalReject(
                    new DeferredRejectionMessage<E>(
                        DeferredRejectionReason.External,
                        data,
                    ),
                );
            };
        });
    }
}
