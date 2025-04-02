"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const debug_1 = __importDefault(require("debug"));
const net_1 = require("net");
const ssh2_1 = require("ssh2");
const config_1 = require("./lib/config");
const log = (0, debug_1.default)("reverse-tunnel-ssh");
function createClient(rawConfig, callback) {
    const config = (0, config_1.createConfig)(rawConfig);
    const remoteHost = config.dstHost;
    const remotePort = config.dstPort; // 타입 캐스팅 (config 검증에서 null이 아님이 확인됨)
    const srcHost = config.srcHost;
    const srcPort = config.srcPort;
    const conn = new ssh2_1.Client();
    const errors = [];
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
    conn.on("tcp connection", function (info, accept, reject) {
        let remote;
        const srcSocket = new net_1.Socket();
        log("tcp connection", info);
        srcSocket.on("error", function (err) {
            errors.push(err);
            if (remote === undefined) {
                reject();
            }
            else {
                remote.end();
            }
        });
        srcSocket.connect(srcPort, srcHost, function () {
            remote = accept();
            log("accept remote connection");
            srcSocket.pipe(remote).pipe(srcSocket);
            if (errors.length === 0) {
                callback(null, conn);
            }
            else {
                callback(errors, null);
            }
        });
    });
    conn.connect(config);
    return conn;
}
module.exports = createClient;
