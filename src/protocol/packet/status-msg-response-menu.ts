import { MethodName } from '../method-name';
import { GenericSend } from './generic-send';

export class StatusMsgResponseMenu extends GenericSend
{
    method = MethodName.StatusMsgResponseMenu;
    instanceName: string;
    body!: {
        id: number;
        userInput?: string | boolean | number;
        state: boolean;
        localExit: boolean;
    };

    constructor(
        instanceName: string,
        itemNumber: number,
        input?: string | boolean | number,
    )
    {
        super();
        this.instanceName = instanceName;
        this.body = {
            id: itemNumber,
            userInput: input,
            state: true,
            localExit: false,
        };
    }
}
