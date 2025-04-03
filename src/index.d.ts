import { Client } from "ssh2";

// TunnelConfig 인터페이스 직접 정의
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
   * Alternative Server Host property
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
   * Local Host
   */
  localHost?: string;
  /**
   * Additional properties
   */
  [key: string]: any;
}

export type ClientConnection = Client;

export type TunnelCallback = (
  errors: Error[] | null,
  clientConnection: Client | null
) => void;

/**
 * Create a reverse SSH tunnel
 *
 * @param config Tunnel configuration
 * @param callback Callback function called on connection
 * @returns SSH client connection
 */
export default function tunnel(
  config: Partial<TunnelConfig>,
  callback: TunnelCallback
): Client;
