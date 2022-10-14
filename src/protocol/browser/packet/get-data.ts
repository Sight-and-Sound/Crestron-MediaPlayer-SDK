import { MethodName } from '../method-name';
import { Send } from './send';

export class GetData extends Send
{
    method = MethodName.GetData;
    body!: { count: number, item: number };

    constructor(instanceName: string, count: number, item: number = 1)
    {
        super(instanceName);
        this.body = {
            count,
            item
        };
    }
}
