import { MethodName } from '../method-name';
import { Send } from './send';

export class PreviousCategory extends Send
{
    method!: MethodName.PreviousCategory;
    instanceName!: string;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
