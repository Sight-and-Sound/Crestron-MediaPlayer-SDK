import { MethodName } from '../method-name';
import { Send } from './send';

export class Pause extends Send
{
    method = MethodName.Pause;
}
