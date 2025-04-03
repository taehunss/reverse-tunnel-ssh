export interface TunnelConfig {
    /**
     * Optional tunnel name
     */
    name?: string;
    /**
     * Server Host
     */
    host: string;
    /**
     * Server Host for sshHost alias
     */
    sshHost?: string;
    /**
     * Server Username
     */
    username?: string;
    /**
     * Server Password
     */
    password?: string;
    /**
     * Server Private Key
     */
    privateKey?: string | Buffer;
    /**
     * Server Agent
     */
    agent?: string;
    /**
     * SSH Port
     */
    sshPort?: number;
    /**
     * Source Host
     */
    srcHost?: string;
    /**
     * Source Port
     */
    srcPort?: number;
    /**
     * Destination Port
     */
    dstPort: number | null;
    /**
     * Destination Host
     */
    dstHost: string;
    /**
     * Local Host (alias for srcHost)
     */
    localHost?: string;
    /**
     * Additional SSH2 options
     */
    [key: string]: any;
}
export declare function createConfig(userConfig: Partial<TunnelConfig>): TunnelConfig;
export default createConfig;
