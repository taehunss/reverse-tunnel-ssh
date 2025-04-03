"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = createConfig;
const lodash_defaults_1 = __importDefault(require("lodash.defaults"));
function createConfig(userConfig) {
    const env = process.env;
    const { name, host, sshHost, sshPort, username, password, privateKey, agent, srcHost, srcPort, dstPort, dstHost, localHost, } = userConfig;
    const config = (0, lodash_defaults_1.default)(userConfig || {}, {
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
    });
    // Handle sshHost alias (for compatibility with the interface)
    if ((userConfig === null || userConfig === void 0 ? void 0 : userConfig.sshHost) && !userConfig.host) {
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
exports.default = createConfig;
