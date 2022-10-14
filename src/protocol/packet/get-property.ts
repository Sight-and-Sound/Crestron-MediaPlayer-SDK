import { MethodName } from '../method-name';
import { GenericSend } from './generic-send';

export class GetProperty extends GenericSend
{
    method = MethodName.GetProperty;
    body!: { instanceName: string, propName: string };

    constructor(instanceName: string, propertyName: string)
    {
        super();
        this.body = {
            instanceName,
            propName: propertyName,
        };
    }
}
