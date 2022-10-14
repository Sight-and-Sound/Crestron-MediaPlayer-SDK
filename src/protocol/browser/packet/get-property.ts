import { MethodName } from '../method-name';
import { Send } from './send';

export class GetProperty extends Send
{
    method = MethodName.GetProperty;
    body!: { propName: string };

    constructor(instanceName: string, propertyName: string)
    {
        super(instanceName);
        this.body = {
            propName: propertyName,
        };
    }
}
