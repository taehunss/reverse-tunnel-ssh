import { Client } from "ssh2";
import { TunnelConfig } from "./lib/config";
interface ForwardInfo {
    srcIP: string;
    srcPort: number;
    dstIP: string;
    dstPort: number;
}
type TunnelCallback = (error: Error[] | null, client: Client | null) => void;
declare module "ssh2" {
    interface Client {
        on(event: "tcp connection", listener: (info: ForwardInfo, accept: () => ClientChannel, reject: () => void) => void): this;
        emit(event: "forward-in", port: number): boolean;
    }
}
declare function createClient(rawConfig: Partial<TunnelConfig>, callback: TunnelCallback): Client;
export = createClient;
