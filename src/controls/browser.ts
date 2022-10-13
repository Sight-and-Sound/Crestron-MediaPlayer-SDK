import { Observable } from 'rxjs';
import { EventName } from '../protocol/browser/event-name';
import { StatusMsgMenuChanged } from '../protocol/browser/event/status-msg-menu-changed';
import { Property } from '../protocol/browser/property';
import { CrpcProtocol } from '../protocol/crpc';
import { BusyChanged } from '../protocol/event/busy-changed';
import { StateChanged } from '../protocol/event/state-changed';
import { ControlWithPropertiesAbstract } from './control-with-properties-abstract';

export class CrpcBrowser extends ControlWithPropertiesAbstract
{
    public version$: Observable<number> = this._createPropertySubject<number>(
        'Version',
        0,
    );
    public maxReqItems$: Observable<number> = this._createPropertySubject<number>(
        'MaxReqItems',
        0,
    );
    public level$: Observable<number> = this._createPropertySubject<number>(
        'Level',
        0,
    );
    public itemCnt$: Observable<number> = this._createPropertySubject<number>(
        'ItemCnt',
        0,
    );
    public title$: Observable<string> = this._createPropertySubject<string>(
        'Title',
        '',
    );
    public subtitle$: Observable<string> = this._createPropertySubject<string>(
        'Subtitle',
        '',
    );
    public listSpecificFunctions$: Observable<string[]> = this._createPropertySubject<string[]>(
        'ListSpecificFunctions',
        [],
    );
    public isMenuAvailable$: Observable<boolean> = this._createPropertySubject<boolean>(
        'IsMenuAvailable',
        false,
    );
    public statusMsgMenu$: Observable<any> = this._createPropertySubject<any>(
        'StatusMsgMenu',
        {},
    );
    public instance$: Observable<number> = this._createPropertySubject<number>(
        'Instance',
        0,
    );

    constructor(
        _handle: string,
        _uuid: string,
        _instanceName: string,
        _protocol: CrpcProtocol,
    )
    {
        super(_handle, _instanceName, _protocol);
    }

    public initialize(): void
    {
        this._registerEvent(EventName.BusyChanged).catch((e) =>
            console.error('Register BusyChanged failed.', e),
        );
        this._registerEvent(EventName.ClearChanged).catch((e) =>
            console.error('Register ClearChanged failed.', e),
        );
        this._registerEvent(EventName.ListChanged).catch((e) =>
            console.error('Register ListChanged failed.', e),
        );
        this._registerEvent(EventName.StateChanged).catch((e) =>
            console.error('Register StateChanged failed.', e),
        );
        this._registerEvent(EventName.StatusMsgMenuChanged).catch((e) =>
            console.error('Register StatusMsgMenuChanged failed.', e),
        );
        this._getProperty(Property.PropertiesSupported).catch((e) =>
            console.error('Get PropertiesSupported failed.', e),
        );
    }

    protected _handleEvent(event: string, properties: any)
    {
        switch (event as EventName) {
            case EventName.BusyChanged:
                this._onBusyChanged(Object.assign(new BusyChanged(), properties || {}));
                break;
            case EventName.ClearChanged:
                // TODO: ClearChanged
                break;
            case EventName.ListChanged:
                // TODO: ListChanged
                break;
            case EventName.StateChanged:
                this._onStateChanged(Object.assign(new StateChanged(), properties));
                break;
            case EventName.StatusMsgMenuChanged:
                this._onDialogChanged(
                    Object.assign(new StatusMsgMenuChanged(), properties),
                );
                break;
        }
    }
}
