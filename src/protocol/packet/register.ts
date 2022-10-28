import { MethodName } from '../method-name';
import { GenericSend } from './generic-send';

export class Register extends GenericSend
{
    method = MethodName.Register;
    body: {
        uuid: string;
        ver: string;
        maxPacketSize: number;
        type: string;
        encoding: string;
        format: string;
        name: string;
    };

    constructor(uuid: string, direct: boolean = false, version: string = '1.0')
    {
        super();
        this.body = {
            uuid,
            ver: version,
            maxPacketSize: 65535,
            type: direct ? 'cip-direct/json-rpc' : 'symbol/json-rpc',
            encoding: 'UTF-8',
            format: 'JSON',
            name: 'MediaPlayer=1',
        };
    }
}
