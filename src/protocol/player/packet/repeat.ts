import { MethodName } from '../method-name';
import { Send } from './send';

export class Repeat extends Send
{
    method!: MethodName.Repeat;
    instanceName!: string;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
