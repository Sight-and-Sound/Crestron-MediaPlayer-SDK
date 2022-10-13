import { EventName as BrowserEventName } from '../protocol/browser/event-name';
import { EventName } from '../protocol/event-name';
import { EventName as PlayerEventName } from '../protocol/player/event-name';

export class CrpcEventPacket {
    jsonrpc!: string;
    method!: string;
    params!: {
    ev: EventName | BrowserEventName | PlayerEventName;
    handle: string;
    parameters: any;
  };
}
