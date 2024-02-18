# grpc-health-service

gRPC Health service with Check feature

## requirements for dev

* Node v18.x

### install

```sh
npm i
```

Source code is inside `lib`

### test

```sh
npm run test
```

## requirements to use

* Node v18.x

### install library

```sh
npm i @xplora-uk/grpc-health-service
```

### usage

You can check `tests` and `examples`.

```javascript
const { loadPackageDefinition, Server } = require('@grpc/grpc-js');
const { loadSync } = require('@grpc/proto-loader');

const healthServiceLib = require('@xplora-uk/grpc-health-service');

// simplest example
const server = new Server();

// add your services as usual
// server.addService(EchoService.service, { Echo });

// option 1: make health service
const health = healthServiceLib.newHealthService();
server.addService(health.interface, health.implementation);

// option 2: overwrite health checker
const health = healthServiceLib.newHealthService(
  {}, // no need to change options, refer to healthServiceLib.defaultOptions
  async (serviceName, statuses) => {
    // check something related to the service
    return { status: statuses.SERVING };
  },
);

// add health service
server.addService(health.interface, health.implementation);
```
