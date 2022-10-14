import {
    BehaviorSubject,
    filter,
    Observable,
    ReplaySubject,
    share,
    Subject,
} from 'rxjs';
import { CrpcDialog } from '../model/crpc-dialog';
import { EventName as BrowserEventName } from '../protocol/browser/event-name';
import { StatusMsgMenuChanged } from '../protocol/browser/event/status-msg-menu-changed';
import { GetProperty } from '../protocol/browser/packet/get-property';
import { CrpcProtocol } from '../protocol/crpc';
import { EventName } from '../protocol/event-name';
import { BusyChanged } from '../protocol/event/busy-changed';
import { StateChanged } from '../protocol/event/state-changed';
import { RegisterEvent } from '../protocol/packet/register-event';
import { StatusMsgResponseMenu } from '../protocol/packet/status-msg-response-menu';
import { EventName as PlayerEventName } from '../protocol/player/event-name';
import { StatusMsgChanged } from '../protocol/player/event/status-msg-changed';
import { DeferredRejectionMessage } from '../util/deferred/deferred-rejection-message';

export enum PropertyUpdateType
{
    VALUE_CHANGE,
    VALUE_RECEIVE,
}

export abstract class ControlWithPropertiesAbstract
{
    protected _propertySubjects: { [propertyName: string]: Subject<any> } = {};
    protected _propertyValues: { [propertyName: string]: any } = {};
    protected _propertyUpdateType: { [propertyName: string]: PropertyUpdateType } = {};
    protected _busyTimeout?: any;

    public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public dialog$: Subject<CrpcDialog | undefined> = new Subject<CrpcDialog | undefined>();

    protected constructor(
        protected _handle: string,
        protected _instanceName: string,
        protected _protocol: CrpcProtocol,
    )
    {
        this._protocol.event
            .pipe(filter((event) => event.method === `${this._instanceName}.Event`))
            .subscribe((event) =>
                this._handleEvent(event.params.ev as string, event.params.parameters),
            );
    }

    protected abstract _handleEvent(eventName: string, parameters: any): void;

    public getInstanceName(): string
    {
        return this._instanceName;
    }

    protected _onStateChanged(event: StateChanged)
    {
        Object.keys(event)
            .filter((key) => this._propertySubjects[key])
            .forEach((key) => this._updateLocalProperty(key, event[key]));
    }

    protected _onBusyChanged(event?: BusyChanged)
    {
        const isBusy = true === event?.on;

        if (isBusy === this.busy$.getValue()) {
            return;
        }

        if (isBusy) {
            this._busyTimeout = setTimeout( () => this._onBusyChanged(), event?.timeoutSec);
        } else if (this._busyTimeout) {
            clearTimeout(this._busyTimeout);
            delete this._busyTimeout;
        }

        this.busy$.next(isBusy);
    }

    protected _createPropertySubject<T>(
        propertyName: string,
        defaultValue: T,
        updateType: PropertyUpdateType = PropertyUpdateType.VALUE_CHANGE,
        additionalConnectorMethod?: () => void
    ): Observable<T>
    {
        this._propertySubjects[propertyName] = new BehaviorSubject<T>(defaultValue);
        this._propertyUpdateType[propertyName] = updateType;
        return this._propertySubjects[propertyName].pipe(
            share({
                connector: () =>
                {
                    this._getProperty(propertyName);
                    if (additionalConnectorMethod) {
                        additionalConnectorMethod();
                    }
                    return new ReplaySubject<T>(1);
                },
                resetOnRefCountZero: true,
            }),
        );
    }

    protected _updateLocalProperty(propertyName: string, value: any): void
    {
        // Property has no subject
        if (undefined === this._propertySubjects[propertyName]) {
            return;
        }

        // If value did not change and update type is VALUE_CHANGE we don't notify the subjects.
        if (
            this._propertyUpdateType[propertyName] === PropertyUpdateType.VALUE_CHANGE
         && this._propertyValues === value
        ) {
            return;
        }

        this._propertyValues[propertyName] = value;
        this._propertySubjects[propertyName].next(value);
    }

    /**
     * @returns Promise<boolean> true if success, false if error
     */
    protected async _registerEvent(
        type: EventName | BrowserEventName | PlayerEventName,
    ): Promise<boolean>
    {
        const response = await this._protocol.send(
            new RegisterEvent(this._handle, type, this._instanceName),
        );

        if (response instanceof DeferredRejectionMessage) {
            console.error(
                `Failed getting registering ${this._instanceName} event`,
                type,
                response.data,
            );
            return false;
        }

        if (response.error !== null) {
            console.error(`${this._instanceName} _registerEvent();`, response.error);
            return false;
        }

        return true;
    }

    protected async _getProperty(propertyName: string): Promise<void>
    {
        const response = await this._protocol.send(
            new GetProperty(this._instanceName, propertyName),
        );

        if (response instanceof DeferredRejectionMessage) {
            console.error(
                `Failed getting ${this._instanceName} property event`,
                response.reason,
                response.data,
            );
            return;
        }

        Object.keys(response.result)
            .filter((key) => this._propertySubjects[key])
            .forEach((key) => this._updateLocalProperty(key, response.result[key]));
    }

    protected _onDialogChanged(event: StatusMsgMenuChanged | StatusMsgChanged)
    {
        const dialog = Object.assign(
            new CrpcDialog((itemNumber, userInput) =>
            {
                this._protocol.send(
                    new StatusMsgResponseMenu(this._instanceName, itemNumber, userInput),
                );
            }),
            event,
        );

        this.dialog$.next(dialog);
    }
}
