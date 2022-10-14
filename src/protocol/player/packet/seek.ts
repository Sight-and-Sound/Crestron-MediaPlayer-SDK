import { MethodName } from '../method-name';
import { Send } from './send';

export class Seek extends Send
{
    method!: MethodName.Seek;
    body!: { time: number };

    constructor(instanceName: string, time: number)
    {
        super(instanceName);
        this.body.time = time;
    }
}
