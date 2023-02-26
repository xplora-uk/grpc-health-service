const { loadPackageDefinition } = require('@grpc/grpc-js');
const { loadSync } = require('@grpc/proto-loader');
const { join } = require('path');

const defaultOptions = {
  defaults: true,
  enums   : String,
  keepCase: true,
  longs   : String,
  oneofs  : true,
};

async function defaultStateManager(serviceName) {
  return {
    status: 'SERVING',
  };
}

function newHealthService(
  options = defaultOptions,
  stateManager = defaultStateManager,
) {
  const file = join(__dirname, 'health.proto');

  const protoLoaded = loadSync(file, options);

  const packageDefn = loadPackageDefinition(protoLoaded);

  const interface = packageDefn.grpc.health.v1.Health.service;

  async function Check(call, callback) {
    let result = { status: 'UNKNOWN' };
    try {
      const out = await stateManager(call.request.service);
      if (out && ('status' in out) && (typeof out.status === 'string')) {
        result = output;
      }
    } catch (err) {
      result.status = 'NOT_SERVING';
    }
    return callback(null, result);
  }

  return {
    interface,
    implementation: { Check },
  };
}

module.exports = {
  newHealthService,
  defaultOptions,
  defaultStateManager,
};
