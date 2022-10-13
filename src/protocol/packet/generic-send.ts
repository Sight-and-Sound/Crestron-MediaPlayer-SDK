import { MethodName as BrowserMethodName } from '../browser/method-name';
import { MethodName } from '../method-name';
import { MethodName as PlayerMethodName } from '../player/method-name';

export abstract class GenericSend
{
    method!: MethodName | BrowserMethodName | PlayerMethodName;
    body: any = null;
}
