export class ReceivePacket
{
    jsonrpc!: string;
    id?: number;
    result?: any;
    method?: string;
    params?: any;
    objects?: any;
    error?: any;
}
