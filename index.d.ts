declare module "@taehunss1215/reverse-tunnel-ssh" {
  import { Client as SSH2Client } from "ssh2";

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
    [key: string]: any; // 추가 SSH2 옵션을 위한 인덱스 시그니처
  }

  export interface ClientConnection extends SSH2Client {
    on(event: "error", callback: (error: Error) => void): this;
    on(event: "close", callback: () => void): this;
    on(event: "forward-in", callback: (port: number) => void): this;
    end(): void;
  }

  export type TunnelCallback = (
    errors: Error[] | null,
    clientConnection: ClientConnection | null
  ) => void;

  function tunnel(
    config: Partial<TunnelConfig>,
    callback: TunnelCallback
  ): ClientConnection;

  export = tunnel;
}
