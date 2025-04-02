import debug from "debug";
import { Socket } from "net";
import { Client, ClientChannel } from "ssh2";
import { createConfig, TunnelConfig } from "./lib/config";

const log = debug("reverse-tunnel-ssh");

interface ForwardInfo {
  srcIP: string;
  srcPort: number;
  dstIP: string;
  dstPort: number;
}

type TunnelCallback = (error: Error[] | null, client: Client | null) => void;

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

function createClient(
  rawConfig: Partial<TunnelConfig>,
  callback: TunnelCallback
): Client {
  const config = createConfig(rawConfig);
  const remoteHost = config.dstHost;
  const remotePort = config.dstPort as number; // 타입 캐스팅 (config 검증에서 null이 아님이 확인됨)
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

export = createClient;
