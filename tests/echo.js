const { loadPackageDefinition, Server } = require('@grpc/grpc-js');
const { loadSync } = require('@grpc/proto-loader');
const { join } = require('path');

const options = {
  defaults: true,
  enums   : String,
  keepCase: true,
  longs   : String,
  oneofs  : true,
};

const file = join(__dirname, '..', 'echo.proto');
const protoLoaded = loadSync(file, options);
const protocol = loadPackageDefinition(protoLoaded);
const { EchoService } = protocol.grpc.echo.v1;

function Echo(call, callback) {
  return callback(null, { data: call.request.data });
}

function newEchoServer() {
  const server = new Server();
  server.addService(EchoService.service, { Echo });
  return server;
}

module.exports = {
  newEchoServer,
  protocol,
};
