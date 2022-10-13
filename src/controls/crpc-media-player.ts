import { CrpcObject } from '../model/crpc-object';
import { CrpcProtocol } from '../protocol/crpc';
import { EventName } from '../protocol/event-name';
import { GetObjects } from '../protocol/packet/get-objects';
import { Register } from '../protocol/packet/register';
import { RegisterEvent } from '../protocol/packet/register-event';
import { GetMenu } from '../protocol/player/packet/get-menu';
import { DeferredRejectionMessage } from '../util/deferred/deferred-rejection-message';
import { CrpcBrowser } from './browser';
import { CrpcPlayer } from './player';

export class CrpcMediaPlayer {
    private _objects: CrpcObject[] = [];
    private readonly _protocol: CrpcProtocol;

    public browser?: CrpcBrowser;
    public player?: CrpcPlayer;

    /**
   * @param _uuid Make sure this id is always the same for the client you are using!
   * @param _handle Possible custom handle to use for comms, by default crestron used "sg", we use "hmp(Html Media Player)"
   */
    constructor(private _uuid: string, private _handle = 'hmp') {
        this._protocol = new CrpcProtocol(_handle);
    }

    public async initialize(): Promise<void> {
        await this.register();

        await this._getObjects();

        await this._registerEvent(EventName.ObjectDirectoryChanged);
    }

    private async register(): Promise<void> {
        await this._protocol.send(new Register(this._uuid, this._protocol.version));
    }

    private async _getObjects(): Promise<void> {
        const response = await this._protocol.send(new GetObjects());

        if (response instanceof DeferredRejectionMessage) {
            console.error('Failed getting objects', response.data);
            return;
        }

        this._objects = response.result.objects.object.map((rawObj: any) => {
            const obj: CrpcObject = Object.assign(new CrpcObject(), rawObj);

            if (obj.isMediaPlayer()) {
                this.player = new CrpcPlayer(
                    this._handle,
                    obj.uuid,
                    obj.instanceName,
                    this._protocol,
                );
            }
            if (obj.isMenu()) {
                this.browser = new CrpcBrowser(
                    this._handle,
                    obj.uuid,
                    obj.instanceName,
                    this._protocol,
                );
            }

            return obj;
        });

        if (!this.browser) {
            this.browser = await this._getBrowser();
        }
    }

    /**
   * @returns Promise<CrpcBrowser | undefined> if undefined the browser could not be retrieved for some reason!
   */
    private async _getBrowser(): Promise<CrpcBrowser | undefined> {
        if (!this.player) {
            throw Error(
                'Could not get CrpcBrowser as there is no player available to browse!',
            );
        }

        if (this.browser) {
            return this.browser;
        }

        const response = await this._protocol.send(
            new GetMenu(this.player!.getInstanceName(), this._uuid),
        );

        if (response instanceof DeferredRejectionMessage) {
            console.error('Failed getting objects', response.data);
            return undefined;
        }

        const instanceName =
      response.result.instanceName || response.result.instancename;
        return new CrpcBrowser(
            this._handle,
            this._uuid,
            instanceName,
            this._protocol,
        );
    }

    /**
   * @returns Promise<boolean> true if success, false if error
   */
    private async _registerEvent(type: EventName): Promise<boolean> {
        const response = await this._protocol.send(
            new RegisterEvent(this._handle, type),
        );

        if (response instanceof DeferredRejectionMessage) {
            console.error('Failed getting registering event ', type, response.data);
            return false;
        }

        if (response.error !== null) {
            console.error('registerEvent(); ', response.error);
            return false;
        }
        if (response.result.ver !== this._protocol.version) {
            console.warn('registerEvent(); version mismatch!');
        }

        return true;
    }
}
