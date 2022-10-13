export class TransmitPacket
{
    readonly jsonrpc = '2.0';
    method!: string;
    id!: number | string | null;
    params!: any;
}
