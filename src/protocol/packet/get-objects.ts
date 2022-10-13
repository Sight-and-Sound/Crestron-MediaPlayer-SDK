import { MethodName } from '../method-name';
import { GenericSend } from './generic-send';

export class GetObjects extends GenericSend
{
    method = MethodName.GetObjects;
}
