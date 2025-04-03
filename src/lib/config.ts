import defaults from "lodash.defaults";

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

export function createConfig(userConfig: Partial<TunnelConfig>): TunnelConfig {
  const env = process.env;
  const {
    name,
    host,
    sshHost,
    sshPort,
    username,
    password,
    privateKey,
    agent,
    srcHost,
    srcPort,
    dstPort,
    dstHost,
    localHost,
  } = userConfig;

  const config = defaults(userConfig || {}, {
    username: username || env.TUNNELSSH_USER || env.USER || env.USERNAME,
    password: password || env.TUNNELSSH_PASSWORD,
    privateKey: privateKey || env.TUNNELSSH_PRIVATE_KEY,
    agent: agent || env.SSH_AUTH_SOCK,
    sshPort: sshPort || 22,
    srcPort: srcPort || 0,
    srcHost: srcHost || "localhost",
    dstPort: dstPort || null,
    dstHost: dstHost || "localhost",
    localHost: localHost || "localhost",
    host: host || sshHost || "localhost",
    name: name || sshHost || "localhost",
  }) as TunnelConfig;

  // Handle sshHost alias (for compatibility with the interface)
  if (userConfig?.sshHost && !userConfig.host) {
    userConfig.host = userConfig.sshHost;
  }
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
