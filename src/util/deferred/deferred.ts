/**
 * T = Resolve type
 * E = Reject type
 */
export class Deferred<T, E>
{
    public resolve!: (data: T) => void;
    public reject!: (error: E) => void;
    public promise: Promise<T> = new Promise<T>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    });
}
