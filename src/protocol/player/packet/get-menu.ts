import { MethodName } from '../method-name';
import { Send } from './send';

export class GetMenu extends Send {
    method!: MethodName.GetMenu;
    instanceName!: string;
    uuid!: string;

    constructor(instanceName: string, uuid: string) {
        super();
        this.instanceName = instanceName;
        this.uuid = uuid;
    }
}
