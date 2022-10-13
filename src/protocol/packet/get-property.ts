import { MethodName } from '../method-name';
import { GenericSend } from './generic-send';

export class GetProperty extends GenericSend
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
