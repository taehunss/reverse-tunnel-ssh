"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = createConfig;
const lodash_defaults_1 = __importDefault(require("lodash.defaults"));
function createConfig(userConfig) {
    const env = process.env;
    const config = (0, lodash_defaults_1.default)(userConfig || {}, {
        username: env.TUNNELSSH_USER || env.USER || env.USERNAME,
        sshPort: 22,
        srcHost: "localhost",
        dstPort: null,
        dstHost: "localhost",
        localHost: "localhost",
    });
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
