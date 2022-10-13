/**

 {
    "jsonrpc": "2.0",
    "result": {
        "objects": {
            "object": [
                {
                    "@category": "Media",
                    "name": "MediaPlayerMenu",
                    "instancename": "MediaPlayerMenu1",
                    "interfaces": [
                        "IMenu"
                    ],
                    "uuid": "5880ccad-4741-42fd-b1b6-03d995586ea2",
                    "isIMediaPlayer": false
                },
                {
                    "@category": "Media",
                    "name": "MediaPlayer",
                    "instancename": "MediaPlayer1",
                    "interfaces": [
                        "IMediaPlayer"
                    ],
                    "uuid": "9c09b9f7-40bb-4f16-86fd-255231049690",
                    "isIMediaPlayer": true
                }
            ]
        }
    },
    "error": null,
    "id": 64299
}
*/
export class CrpcObject {
    public '@category'!: string;
    public uuid!: string;
    public instanceName!: string;
    public name!: string;
    public interfaces: string[] = [];
    public isIMediaPlayer!: boolean;

    // for some reason DM-NAX returns lowercase instancename, set that straight.
    public set instancename(val: string) {
        this.instanceName = val;
    }

    public isMediaPlayer(): boolean {
        return (
            this.isIMediaPlayer || this.interfaces.indexOf('IMediaPlayer') !== -1
        );
    }

    public isMenu(): boolean {
        return this.interfaces.indexOf('IMenu') !== -1;
    }
}
