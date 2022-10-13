import { MethodName } from '../method-name';
import { Send } from './send';

export class PreviousTrack extends Send
{
    method!: MethodName.PreviousTrack;
    instanceName!: string;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
