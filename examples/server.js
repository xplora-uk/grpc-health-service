const { loadPackageDefinition, Server, ServerCredentials } = require('@grpc/grpc-js');
const { loadSync } = require('@grpc/proto-loader');
const { join } = require('path');
const lib = require('../lib');
const { host } = require('./_shared');

const options = {
  defaults: true,
  enums   : String,
  keepCase: true,
  longs   : String,
  oneofs  : true,
};

const echoFile = join(__dirname, '..', 'echo.proto');
const echoProto = loadSync(echoFile, options);
const echoProtocol = loadPackageDefinition(echoProto);
const echoServiceInterface = echoProtocol.grpc.echo.v1.EchoService.service;

main();

function Echo(call, callback) {
  console.log('new request to Echo()...', call.request);
  return callback(null, { data: call.request.data });
}

function main() {
  const server = new Server();

  server.addService(echoServiceInterface, { Echo });

  const healthService = lib.newHealthService();
  server.addService(healthService.interface, healthService.implementation);

  console.log('bindAsync...');
  server.bindAsync(host, ServerCredentials.createInsecure(), (err, port) => {
    console.log('bindAsync...done', { err, port });
    if (err) return;
    console.log('starting...');
    server.start();
    console.log('starting...done');
  });
}
