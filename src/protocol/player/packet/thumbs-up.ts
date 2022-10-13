import { MethodName } from '../method-name';
import { Send } from './send';

export class ThumbsUp extends Send
{
    method!: MethodName.ThumbsUp;
    instanceName!: string;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
