import { MethodName } from '../method-name';
import { Send } from './send';

export class NextCategory extends Send {
    method!: MethodName.NextCategory;
    instanceName!: string;

    constructor(instanceName: string) {
        super();
        this.instanceName = instanceName;
    }
}
