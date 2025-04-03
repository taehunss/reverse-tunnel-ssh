import { Client } from "ssh2";
import { TunnelConfig } from "./lib/config";
export type { TunnelConfig };
export type ClientConnection = Client;
interface ForwardInfo {
    srcIP: string;
    srcPort: number;
    dstIP: string;
    dstPort: number;
}
export type TunnelCallback = (errors: Error[] | null, clientConnection: Client | null) => void;
declare module "ssh2" {
    interface Client {
        on(event: "tcp connection", listener: (info: ForwardInfo, accept: () => ClientChannel, reject: () => void) => void): this;
        emit(event: "forward-in", port: number): boolean;
    }
}
/**
 * Create a reverse SSH tunnel
 *
 * @param config Tunnel configuration
 * @param callback Callback function called on connection
 * @returns SSH client connection
 */
declare function createClient(rawConfig: Partial<TunnelConfig>, callback: TunnelCallback): Client;
export default createClient;
