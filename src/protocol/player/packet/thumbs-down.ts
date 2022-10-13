import { MethodName } from '../method-name';
import { Send } from './send';

export class ThumbsDown extends Send {
    method!: MethodName.ThumbsDown;
    instanceName!: string;

    constructor(instanceName: string) {
        super();
        this.instanceName = instanceName;
    }
}
