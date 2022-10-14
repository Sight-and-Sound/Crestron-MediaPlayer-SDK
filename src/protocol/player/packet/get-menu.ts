import { MethodName } from '../method-name';
import { Send } from './send';

export class GetMenu extends Send
{
    method!: MethodName.GetMenu;
    body!: { uuid: string };

    constructor(instanceName: string, uuid: string)
    {
        super(instanceName);
        this.body = { uuid };
    }
}
