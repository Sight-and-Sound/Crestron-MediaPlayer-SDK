import { MethodName } from '../method-name';
import { Send } from './send';

export class FastForward extends Send
{
    method!: MethodName.Ffwd;
}
