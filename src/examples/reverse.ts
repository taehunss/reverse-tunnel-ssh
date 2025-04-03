import http from "http";
import { reverseTunnel } from "../index";
import { TunnelConfig } from "../lib/config";

// This is a very handy way to test your next webhook !

// Please set up your /etc/hosts or change the hostname before
// running the example.

const config: TunnelConfig = {
  host: "tunneltest.com",
  username: "root",
  dstHost: "0.0.0.0", // bind to all interfaces (see hint in the readme)
  dstPort: 8000,
  //srcHost: '127.0.0.1', // default
  //srcPort: dstPort // default is the same as dstPort
};

reverseTunnel(config, (error, clientConnection) => {
  if (error) {
    console.error("Error creating tunnel:", error);
    return;
  }
  console.log("Tunnel created successfully");
});

http
  .createServer((req, res) => {
    res.end("SSH-TUNNEL: Gate to heaven !");
  })
  .listen(config.dstPort);

console.log("Tunnel created: http://" + config.host + ":" + config.dstPort);
