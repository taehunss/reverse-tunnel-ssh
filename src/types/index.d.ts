/* eslint-disable @typescript-eslint/no-explicit-any */

// TypeScript 글로벌 타입 확장
declare global {
  namespace ReverseTunnelSSH {
    interface TunnelConfig {
      name?: string;
      host: string;
      sshHost?: string;
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

    type TunnelCallback = (
      errors: Error[] | null,
      clientConnection: import("ssh2").Client | null
    ) => void;
  }
}

// 타입스크립트 모듈 시스템 지원
export as namespace ReverseTunnelSSH;
export {};
