import { MethodName } from '../method-name';
import { Send } from './send';

export class GetProperty extends Send
{
    method = MethodName.GetProperty;
    instanceName!: string;
    body!: { propName: string };

    constructor(instanceName: string, propertyName: string)
    {
        super();
        this.instanceName = instanceName;
        this.body = {
            propName: propertyName,
        };
    }
}
