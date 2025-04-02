export interface TunnelConfig {
    host: string;
    username?: string;
    password?: string;
    privateKey?: string | Buffer;
    agent?: string;
    sshPort?: number;
    srcHost?: string;
    srcPort?: number;
    dstPort: number | null;
    dstHost: string;
    localHost?: string;
    [key: string]: any;
}
export declare function createConfig(userConfig?: Partial<TunnelConfig>): TunnelConfig;
export default createConfig;
