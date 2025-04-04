# reverse-tunnel-ssh
Easy ssh reverse tunnel with TypeScript and ES6+ support


![Tunnel-SSH Logo](https://i.imgur.com/2pdoADB.png)

# Copyright Notice

This package is a TypeScript conversion of the original [reverse-tunnel-ssh](https://www.npmjs.com/package/reverse-tunnel-ssh) library developed by Christoph Hagenbrock (@chbrock). All copyrights for the original library belong to the original developer, and this derivative work is distributed under the terms of the MIT license.

This project aims to maintain the original functionality while adding TypeScript support and type safety.






# How to use
```sh
npm i @taehunss1215/reverse-tunnel-ssh
```

### JavaScript
```js
// Tunnel your local port 8000 to tunneltest.com:8000

// tunnel is a ssh2 clientConnection object
var reverseTunnel = require('@taehunss1215/reverse-tunnel-ssh').reverseTunnel;
// Or you can use the default export for backward compatibility:
// var reverseTunnel = require('@taehunss1215/reverse-tunnel-ssh');

reverseTunnel({
  host: 'tunneltest.com',
  username: 'root',
  dstHost: '0.0.0.0', // bind to all IPv4 interfaces
  dstPort: 8000,
  //srcHost: '127.0.0.1', // default
  //srcPort: dstPort // default is the same as dstPort
}, function(error, clientConnection) {
  //
});

// Tunnel your local port 8000 to a free port on tunneltest.com

var conn = reverseTunnel({
  host: 'tunneltest.com',
  username: 'somebody',
  dstHost: '0.0.0.0', // bind to all IPv4 interfaces
  dstPort: 0, // dynamically choose an open port on tunneltest.com
  //srcHost: '127.0.0.1', // default
  srcPort: 8000, // must be specified if dstPort=0
}, function (error, clientConnection) {
  //
});
conn.on('forward-in', function (port) {
  console.log('Forwarding from tunneltest.com:' + port);
});
```

### TypeScript
```typescript
import { reverseTunnel, TunnelConfig } from '@taehunss1215/reverse-tunnel-ssh';
// Or you can use the default export for backward compatibility:
// import reverseTunnel from '@taehunss1215/reverse-tunnel-ssh';

// Tunnel your local port 8000 to tunneltest.com:8000
const config: TunnelConfig = {
  host: 'tunneltest.com',
  username: 'root',
  dstHost: '0.0.0.0', // bind to all IPv4 interfaces
  dstPort: 8000,
  //srcHost: '127.0.0.1', // default
  //srcPort: config.dstPort // default is the same as dstPort
};

// Create tunnel
reverseTunnel(config, (error, clientConnection) => {
  if (error) {
    console.error('Error creating tunnel:', error);
    return;
  }
  console.log('Tunnel created successfully');
});

// Tunnel your local port 8000 to a free port on tunneltest.com
const conn = reverseTunnel({
  host: 'tunneltest.com',
  username: 'somebody',
  dstHost: '0.0.0.0', // bind to all IPv4 interfaces
  dstPort: 0, // dynamically choose an open port on tunneltest.com
  srcPort: 8000, // must be specified if dstPort=0
}, (error, clientConnection) => {
  if (error) {
    console.error('Error:', error);
  }
});

conn.on('forward-in', (port) => {
  console.log('Forwarding from tunneltest.com:' + port);
});
```

If you plan to expose a local port on a remote machine (external interface) you need to enable the "GatewayPorts" option in your 'sshd_config'

```sh
# What ports, IPs and protocols we listen for
Port 22
GatewayPorts yes
```