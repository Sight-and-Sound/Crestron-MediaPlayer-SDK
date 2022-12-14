import { GenericSend } from '../../packet/generic-send';
import { MethodName } from '../method-name';

export abstract class Send extends GenericSend
{
    method!: MethodName;
    instanceName!: string;
    body!: any;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
