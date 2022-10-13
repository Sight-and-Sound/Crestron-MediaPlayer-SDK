import { Subject } from 'rxjs';
import { CrpcDialog } from '../model/crpc-dialog';
import { CrpcEventPacket } from '../model/crpc-event-packet';
import { ReceivePacket } from '../model/receive-packet';
import { TransmitPacket } from '../model/transmit-packet';
import { Deferred } from '../util/deferred/deferred';
import { TemporaryDeferred } from '../util/deferred/temporary-deferred';
import { Send as BrowserSend } from './browser/packet/send';
import { GenericSend } from './packet/generic-send';
import { Send as PlayerSend } from './player/packet/send';

export class CrpcProtocol
{
    /**
     *  @description Output to inject into transport
     */
    public transmit: Subject<string> = new Subject<string>();
    /**
     * @description Once an event is received it will pass through here.
     */
    public event: Subject<CrpcEventPacket> = new Subject<CrpcEventPacket>();
    public dialog: Subject<CrpcDialog | null> = new Subject<CrpcDialog | null>();

    public version = '1.0';

    private readonly _jsonStart = '{"jsonrpc":';
    private _deferredById: {
        [messageId: number]: Deferred<any, any> | TemporaryDeferred<any, any>;
    } = {};

    private _lastMessageId = Math.floor(Math.random() * (65535 - 10 + 1)) + 10;
    private _parseBuffer = '';
    private _lastParsedInput = '';

    constructor(private _handle: string)
    {
    }

    private _parsePartial(input: string): void
    {
        // Make sure to never inject double messages into our buffer.
        if (this._lastParsedInput === input) {
            console.log('Received duplicate input for parsing, ignored it.');
            return;
        }
        this._lastParsedInput = input;

        const header = input.substring(0, 8);
        const isEnd = header.charAt(3) === 'e';
        const partialMessage = input.substring(8);

        // If message is not complete, start filling up the buffer.
        if (!isEnd) {
            // When we receive
            if (
                partialMessage.startsWith(this._jsonStart) &&
                this._parseBuffer !== ''
            ) {
                this._parseBuffer = partialMessage;
                console.warn('Buffer already had data but received new json start, clearing!');
                return;
            }

            this._parseBuffer = this._parseBuffer + partialMessage;
            return;
        }

        // Message end received, start parsing
        this._parseFull(this._parseBuffer + partialMessage);
        this._parseBuffer = '';
    }

    private _parseFull(data: string): void
    {
        const messages = data.split(this._jsonStart);
        if (messages.length > 2) {
            messages.forEach((message) => {
                if (message === '') {
                    return true;
                }
                this._parseFull(this._jsonStart + message);
            });
            return;
        }

        let packet = new ReceivePacket();
        try {
            packet = Object.assign(packet, JSON.parse(data));
        } catch (ex) {
            console.error(new Date(), 'Failed parsing json;', ex);
            return;
        }

        this._handlePacket(packet);
    }

    private _handlePacket(packet: ReceivePacket): void
    {
        // Check for callbacks and call them when available
        if (packet.id && this._deferredById[packet.id]) {
            if (packet.error) {
                this._deferredById[packet.id]?.reject(packet);
                delete this._deferredById[packet.id];
            } else {
                this._deferredById[packet.id]?.resolve(packet);
                delete this._deferredById[packet.id];
            }
        }

        // Check for event type messages to trigger event subject
        if (packet.method && packet.method.endsWith('.Event')) {
            const event = Object.assign(new CrpcEventPacket(), packet);
            this.event.next(event);
            return;
        }
    }

    public receive(message: string): void
    {
        this._parsePartial(message);
    }

    public sendRaw(
        instanceStr: string,
        method: string,
        params: unknown = null,
    ): Promise<any>
    {
        const messageId =
            this._lastMessageId >= 65535 ? 1000 : this._lastMessageId + 1;
        const message = Object.assign(new TransmitPacket(), {
            id: this._lastMessageId,
            method: `${instanceStr}.${method}`,
            params,
        });

        let data = JSON.stringify(message);
        while (data.length > 0) {
            const partial = data.substring(0, data.length > 247 ? 247 : data.length);
            data = data.replace(partial, '');
            const flag = data.length === 0 ? 'e' : 'c';
            this.transmit.next(
                `205${flag}00${partial.length.toString(16)}${partial}`,
            );
        }

        this._deferredById[messageId] = new TemporaryDeferred(
            10000,
            () => delete this._deferredById[messageId],
        );

        this._lastMessageId = messageId;
        return this._deferredById[messageId].promise;
    }

    public send(packet: GenericSend): Promise<any>
    {
        if (packet instanceof BrowserSend || packet instanceof PlayerSend) {
            return this.sendRaw(packet.instanceName, packet.method, packet.body);
        }

        return this.sendRaw('Crpc', packet.method, packet.body);
    }
}
