import defaults from "lodash.defaults";

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

export function createConfig(userConfig?: Partial<TunnelConfig>): TunnelConfig {
  const env = process.env;

  const config = defaults(userConfig || {}, {
    username: env.TUNNELSSH_USER || env.USER || env.USERNAME,
    sshPort: 22,
    srcHost: "localhost",
    dstPort: null,
    dstHost: "localhost",
    localHost: "localhost",
  }) as TunnelConfig;

  // Try to use ssh-agent if no auth information was set
  if (!config.password && !config.privateKey) {
    config.agent = config.agent || process.env.SSH_AUTH_SOCK;
  }

  // No local route, no remote route.. exit here
  if (config.dstPort === null || !config.dstHost || !config.host) {
    throw new Error("invalid configuration.");
  }

  // Use the same port number local
  if (config.srcPort === undefined) {
    if (!config.dstPort) {
      throw new Error("must specify srcPort or dstPort");
    }
    config.srcPort = config.dstPort;
  }

  return config;
}

export default createConfig;
