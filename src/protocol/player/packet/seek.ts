import { MethodName } from '../method-name';
import { Send } from './send';

export class Seek extends Send
{
    method!: MethodName.Seek;
    instanceName!: string;
    body!: { time: number };

    constructor(instanceName: string, time: number)
    {
        super();
        this.instanceName = instanceName;
        this.body = {time};
    }
}
