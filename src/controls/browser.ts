import { Observable } from 'rxjs';
import { EventName } from '../protocol/browser/event-name';
import { StatusMsgMenuChanged } from '../protocol/browser/event/status-msg-menu-changed';
import { Property } from '../protocol/browser/property';
import { CrpcProtocol } from '../protocol/crpc';
import { BusyChanged } from '../protocol/event/busy-changed';
import { StateChanged } from '../protocol/event/state-changed';
import { ControlWithPropertiesAbstract, PropertyUpdateType } from './control-with-properties-abstract';
import { CrpcListItem, ListItem } from './list-item';
import { GetData } from '../protocol/browser/packet/get-data';
import { Back } from '../protocol/browser/packet/back';
import { Select } from '../protocol/browser/packet/select';

export class CrpcBrowser extends ControlWithPropertiesAbstract
{
    private _automaticListItemRetrievalEnabled: boolean = false;

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
        PropertyUpdateType.VALUE_RECEIVE
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
    public items$: Observable<ListItem[]> = this._createPropertySubject<ListItem[]>(
        'ListItems',
        [],
        PropertyUpdateType.VALUE_CHANGE,
        () => this._enableAutomaticListRetrieval()
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

    private _enableAutomaticListRetrieval(): void
    {
        this.itemCnt$.subscribe({
            next: async (itemCount: number) => {
                if (itemCount === 0) {
                    this._updateLocalProperty('ListItems', []);
                    return;
                }

                const response = await this._protocol.send(
                    new GetData(this._instanceName, itemCount)
                ).catch((e) => console.error('Failed to retrieve browser list items!', e));

                const items = ((response.result || []) as CrpcListItem[]).map((rawItem, index) => {
                    return ListItem.fromCrpc(
                        rawItem,
                        (index + 1),
                        () => this._selectItemByIndex(index + 1)
                    );
                });
                this._updateLocalProperty('ListItems', items);
            }
        })
    }

    private _selectItemByIndex(index: number): void
    {
        this._protocol.send(
            new Select(this._instanceName, index)
        );
    }

    public back(): void
    {
        this._protocol.send(
            new Back(this._instanceName)
        );
    }
}
