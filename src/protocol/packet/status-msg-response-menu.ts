import { MethodName } from '../method-name';
import { GenericSend } from './generic-send';

export class StatusMsgResponseMenu extends GenericSend
{
    method = MethodName.StatusMsgResponseMenu;
    body!: {
        instanceName?: string;
        id: number;
        userInput?: string | boolean | number;
        state: boolean;
        localExit: boolean;
    };

    constructor(
        public instanceName: string,
        itemNumber: number,
        input?: string | boolean | number,
    )
    {
        super();
        this.body = {
            instanceName,
            id: itemNumber,
            userInput: input,
            state: true,
            localExit: false,
        };
    }
}
