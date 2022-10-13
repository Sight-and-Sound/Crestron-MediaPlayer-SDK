import { MethodName } from '../method-name';
import { Send } from './send';

export class Play extends Send {
    method!: MethodName.Play;
    instanceName!: string;

    constructor(instanceName: string) {
        super();
        this.instanceName = instanceName;
    }
}
