import { ReceivePacket } from '../model/receive-packet';

export type CrpcMessageCallback = (reply: ReceivePacket) => void;
