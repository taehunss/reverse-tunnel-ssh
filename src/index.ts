import debug from "debug";
import { Socket } from "net";
import { Client, ClientChannel } from "ssh2";
import createConfig, { TunnelConfig } from "./lib/config";

// 타입 내보내기
export type { TunnelConfig };
export type ClientConnection = Client;

const log = debug("reverse-tunnel-ssh");

interface ForwardInfo {
  srcIP: string;
  srcPort: number;
  dstIP: string;
  dstPort: number;
}

// TunnelCallback 타입 정의 및 export
export type TunnelCallback = (
  errors: Error[] | null,
  clientConnection: Client | null
) => void;

// ssh2 라이브러리 타입 확장
declare module "ssh2" {
  interface Client {
    on(
      event: "tcp connection",
      listener: (
        info: ForwardInfo,
        accept: () => ClientChannel,
        reject: () => void
      ) => void
    ): this;
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
function createClient(
  rawConfig: Partial<TunnelConfig>,
  callback: TunnelCallback
): Client {
  const config = createConfig(rawConfig);
  const remoteHost = config.dstHost;
  const remotePort = config.dstPort as number;
  const srcHost = config.srcHost as string;
  const srcPort = config.srcPort as number;

  const conn = new Client();
  const errors: Error[] = [];

  conn.on("ready", function () {
    log("ready");
    conn.forwardIn(remoteHost, remotePort, function (err, port) {
      if (err) {
        errors.push(err);
        throw err;
      }
      conn.emit("forward-in", port);
    });
  });

  conn.on("tcp connection", function (info: ForwardInfo, accept, reject) {
    let remote: ClientChannel | undefined;
    const srcSocket = new Socket();

    log("tcp connection", info);
    srcSocket.on("error", function (err) {
      errors.push(err);
      if (remote === undefined) {
        reject();
      } else {
        remote.end();
      }
    });

    srcSocket.connect(srcPort, srcHost, function () {
      remote = accept();
      log("accept remote connection");
      srcSocket.pipe(remote).pipe(srcSocket);
      if (errors.length === 0) {
        callback(null, conn);
      } else {
        callback(errors, null);
      }
    });
  });
  conn.connect(config);
  return conn;
}

// 기본 내보내기
export default createClient;

// CommonJS 호환성
// @ts-ignore
module.exports = createClient;
// @ts-ignore
module.exports.default = createClient;
// @ts-ignore
module.exports.__esModule = true;
