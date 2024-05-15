import { EventName as BrowserEventName } from '../browser/event-name';
import { EventName } from '../event-name';
import { MethodName } from '../method-name';
import { EventName as PlayerEventName } from '../player/event-name';
import { GenericSend } from './generic-send';

export class RegisterEvent extends GenericSend
{
    method = MethodName.RegisterEvent;
    body!: { handle: string, instanceName?: string, ev: EventName | BrowserEventName | PlayerEventName };

    constructor(
        handle: string,
        event: EventName | BrowserEventName | PlayerEventName,
        public instanceName: string = 'Crpc',
    )
    {
        super();
        this.body = {
            handle,
            ev: event
        };
    }
}
