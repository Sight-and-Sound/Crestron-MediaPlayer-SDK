import { GenericSend } from '../../packet/generic-send';
import { MethodName } from '../method-name';

export class Send extends GenericSend
{
    method!: MethodName;
    instanceName!: string;

    constructor(instanceName: string)
    {
        super();
        this.instanceName = instanceName;
    }
}
