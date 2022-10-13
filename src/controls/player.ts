import { Observable } from 'rxjs';
import { CrpcProtocol } from '../protocol/crpc';
import { BusyChanged } from '../protocol/event/busy-changed';
import { StateChanged } from '../protocol/event/state-changed';
import { EventName } from '../protocol/player/event-name';
import { StatusMsgChanged } from '../protocol/player/event/status-msg-changed';
import { MethodName } from '../protocol/player/method-name';
import { FastForward } from '../protocol/player/packet/fast-forward';
import { NextCategory } from '../protocol/player/packet/next-category';
import { NextTrack } from '../protocol/player/packet/next-track';
import { Pause } from '../protocol/player/packet/pause';
import { Play } from '../protocol/player/packet/play';
import { PreviousCategory } from '../protocol/player/packet/previous-category';
import { PreviousTrack } from '../protocol/player/packet/previous-track';
import { Repeat } from '../protocol/player/packet/repeat';
import { Rewind } from '../protocol/player/packet/rewind';
import { Seek } from '../protocol/player/packet/seek';
import { Shuffle } from '../protocol/player/packet/shuffle';
import { Star } from '../protocol/player/packet/star';
import { ThumbsDown } from '../protocol/player/packet/thumbs-down';
import { ThumbsUp } from '../protocol/player/packet/thumbs-up';
import { Property } from '../protocol/player/property';
import { Rating } from '../protocol/player/rating';
import { ControlWithPropertiesAbstract } from './control-with-properties-abstract';

export class CrpcPlayer extends ControlWithPropertiesAbstract {
    public textLines$: Observable<string[]> = this._createPropertySubject<
    string[]
  >('TextLines', []);

    public actionsSupported$: Observable<MethodName[]> =
        this._createPropertySubject<MethodName[]>('ActionsSupported', []);

    public actionsAvailable$: Observable<MethodName[]> =
        this._createPropertySubject<MethodName[]>('ActionsAvailable', []);

    public progressBar$: Observable<boolean> =
        this._createPropertySubject<boolean>('ProgressBar', false);

    public elapsedSec$: Observable<number> = this._createPropertySubject<number>(
        'ElapsedSec',
        0,
    );

    public trackSec$: Observable<number> = this._createPropertySubject<number>(
        'TrackSec',
        0,
    );

    // TODO: Create num for streamstates: 'streaming'
    public streamState$: Observable<string> = this._createPropertySubject<string>(
        'StreamState',
        '',
    );

    public trackNum$: Observable<number> = this._createPropertySubject<number>(
        'TrackNum',
        0,
    );

    public trackCnt$: Observable<number> = this._createPropertySubject<number>(
        'TrackCnt',
        0,
    );

    // TODO: create enum for playerstates: playing | paused | stopped
    public playerState$: Observable<string> = this._createPropertySubject<string>(
        'PlayerState',
        '',
    );

    // TODO: Check what playerIcon is, i'm guessing it's a crestron icon number.
    public playerIcon$: Observable<number> = this._createPropertySubject<number>(
        'PlayerIcon',
        0,
    );

    public playerName$: Observable<string> = this._createPropertySubject<string>(
        'PlayerName',
        '',
    );

    public playerIconUrl$: Observable<string> =
        this._createPropertySubject<string>('PlayerIconURL', '');

    // TODO: Create enum for media types: 'audio'
    public mediaType$: Observable<string> = this._createPropertySubject<string>(
        'MediaType',
        '',
    );

    public instance$: Observable<number> = this._createPropertySubject<number>(
        'Instance',
        0,
    );

    public albumArt$: Observable<string> = this._createPropertySubject<string>(
        'AlbumArt',
        '',
    );

    public albumArtUrl$: Observable<string> = this._createPropertySubject<string>(
        'AlbumArtUrl',
        '',
    );

    public albumArtUrlNat$: Observable<string> =
        this._createPropertySubject<string>('AlbumArtUrlNAT', '');

    public stationName$: Observable<string> = this._createPropertySubject<string>(
        'StationName',
        '',
    );

    public album$: Observable<string> = this._createPropertySubject<string>(
        'Album',
        '',
    );

    public genre$: Observable<string> = this._createPropertySubject<string>(
        'Genre',
        '',
    );

    public artist$: Observable<string> = this._createPropertySubject<string>(
        'Artist',
        '',
    );

    public title$: Observable<string> = this._createPropertySubject<string>(
        'Title',
        '',
    );

    public language$: Observable<string> = this._createPropertySubject<string>(
        'Language',
        '',
    );

    public rewindSpeed$: Observable<number> = this._createPropertySubject<number>(
        'RewindSpeed',
        0,
    );

    public providerName$: Observable<string> =
        this._createPropertySubject<string>('ProviderName', '');

    public fastForwardSpeed$: Observable<number> =
        this._createPropertySubject<number>('FfwdSpeed', 0);

    public nextTitle$: Observable<string> = this._createPropertySubject<string>(
        'NextTitle',
        '',
    );

    public mediaReady$: Observable<boolean> =
        this._createPropertySubject<boolean>('MediaReady', false);

    // TODO: Create enum for shufflestate: '0'(Off)
    public shuffleState$: Observable<number> =
        this._createPropertySubject<number>('ShuffleState', 0);

    // TODO: Create enum for repeatstate: '0'(not supported?)
    public repeatState$: Observable<number> = this._createPropertySubject<number>(
        'RepeatState',
        0,
    );

    public rating$: Observable<Rating> = this._createPropertySubject<Rating>(
        'Rating',
        new Rating(),
    );

    public selectedId$: Observable<string> = this._createPropertySubject<string>(
        'SelectedId',
        '',
    );

    constructor(
        _handle: string,
        _uuid: string,
        _instanceName: string,
        _protocol: CrpcProtocol,
    ) {
        super(_handle, _instanceName, _protocol);
    }

    public initialize(): void {
        this._registerEvent(EventName.BusyChanged).catch(() => {
            console.error('Register BusyChanged failed.');
        });
        this._registerEvent(EventName.StateChangedByBrowseContext).catch(() => {
            console.error('Register StateChangedByBrowseContext failed.');
        });
        this._registerEvent(EventName.StatusMsgChanged).catch(() => {
            console.error('Register StatusMsgChanged failed.');
        });
        this._registerEvent(EventName.StateChanged).catch(() => {
            console.error('Register StateChanged failed.');
        });
        this._getProperty(Property.PropertiesSupported).catch((e) =>
            console.error('Get PropertiesSupported failed.', e),
        );
        this._getProperty(Property.ActionsSupported).catch((e) =>
            console.error('Get PropertiesSupported failed.', e),
        );
        this._getProperty(Property.ActionsAvailable).catch((e) =>
            console.error('Get PropertiesSupported failed.', e),
        );
    }

    protected _handleEvent(event: string, properties: any) {
        switch (event as EventName) {
            case EventName.BusyChanged:
                this._onBusyChanged(Object.assign(new BusyChanged(), properties || {}));
                break;
            case EventName.StateChangedByBrowseContext:
                // TODO: Handle StateChangedByBrowseContext
                break;
            case EventName.StatusMsgChanged:
                this._onDialogChanged(
                    Object.assign(new StatusMsgChanged(), properties || {}),
                );
                break;
            case EventName.StateChanged:
                this._onStateChanged(Object.assign(new StateChanged(), properties));
                break;
        }
    }

    public play() {
        this._protocol.send(new Play(this._instanceName));
    }

    public pause(): void {
        this._protocol.send(new Pause(this._instanceName));
    }

    public nextTrack(): void {
        this._protocol.send(new NextTrack(this._instanceName));
    }

    public previousTrack(): void {
        this._protocol.send(new PreviousTrack(this._instanceName));
    }

    public nextCategory(): void {
        this._protocol.send(new NextCategory(this._instanceName));
    }

    public previousCategory(): void {
        this._protocol.send(new PreviousCategory(this._instanceName));
    }

    public thumbsUp(): void {
        this._protocol.send(new ThumbsUp(this._instanceName));
    }

    public thumbsDown(): void {
        this._protocol.send(new ThumbsDown(this._instanceName));
    }

    public rewind(): void {
        this._protocol.send(new Rewind(this._instanceName));
    }

    public fastForward(): void {
        this._protocol.send(new FastForward(this._instanceName));
    }

    public shuffle(): void {
        this._protocol.send(new Shuffle(this._instanceName));
    }

    public repeat(): void {
        this._protocol.send(new Repeat(this._instanceName));
    }

    public star(): void {
        this._protocol.send(new Star(this._instanceName));
    }

    public seek(seconds: number): void {
        this._protocol.send(new Seek(this._instanceName, seconds));
    }
}
