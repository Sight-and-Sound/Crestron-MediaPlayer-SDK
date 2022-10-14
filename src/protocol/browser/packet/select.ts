import { MethodName } from '../method-name';
import { Send } from './send';

export class Select extends Send
{
    method = MethodName.Select;
    body!: { item: number };

    constructor(instanceName: string, item: number)
    {
        super(instanceName);
        this.body = {
            item
        };
    }
}
