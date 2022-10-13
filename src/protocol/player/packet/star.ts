import { MethodName } from '../method-name';
import { Send } from './send';

export class Star extends Send
{
    method!: MethodName.Star;
    instanceName!: string;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
