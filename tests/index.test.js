const { loadPackageDefinition, Server } = require('@grpc/grpc-js');
const { loadSync } = require('@grpc/proto-loader');
const { expect } = require('chai');
const { join } = require('path');

const lib = require('../lib');

const options = {
  defaults: true,
  enums   : String,
  keepCase: true,
  longs   : String,
  oneofs  : true,
};

const file = join(__dirname, 'echo.proto');

const protoLoaded = loadSync(file, options);

const packageDefn = loadPackageDefinition(protoLoaded);

const { EchoService } = packageDefn.grpc.echo.v1;

function Echo(call, callback) {
  return callback(null, { data: call.request.data });
}

describe('newHealthService', () => {

  it('should run as expected with default inputs', async() => {
    let error = null;
    try {
      const server = new Server();
      server.addService(EchoService.service, { Echo });

      const health = lib.newHealthService();
      server.addService(health.interface, health.implementation);

    } catch (err) {
      error = err;
    }

    expect(error).to.eq(null);
  });

  it('should run as expected with custom inputs', async () => {
    let error = null;
    try {
      const server = new Server();
      server.addService(EchoService.service, { Echo });

      const healthOptions = {
        defaults: true,
        enums   : String,
        keepCase: true,
        longs   : String,
        oneofs  : true,
      };
      
      async function healthStateManager(serviceName) {
        return {
          status: 'SERVING',
        };
      }

      const health = lib.newHealthService(healthOptions, healthStateManager);
      server.addService(health.interface, health.implementation);

    } catch (err) {
      error = err;
    }

    expect(error).to.eq(null);
  });

});
