import { MethodName } from '../method-name';
import { Send } from './send';

export class NextTrack extends Send
{
    method!: MethodName.NextTrack;
    instanceName!: string;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
