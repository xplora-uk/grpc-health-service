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

function newHealthService(options = {}, stateManager = null) {
  options = { ...defaultOptions, ...(options || {}) };

  const file = join(__dirname, 'health.proto');

  const protoLoaded = loadSync(file, options);

  const protocol = loadPackageDefinition(protoLoaded);

  const interface = protocol.grpc.health.v1.Health.service;
  const statusEnumValueObjects = protocol.grpc.health.v1.HealthCheckResponse.type.enumType[0].value;
  const statuses = Object.fromEntries(statusEnumValueObjects.map(({ name, number }) => [name, number]));

  async function defaultStateManager(serviceName, _statuses) {
    return {
      status: _statuses.SERVING,
    }
  }

  if (!stateManager) stateManager = defaultStateManager;

  async function Check(call, callback) {
    let result = { status: statuses.UNKNOWN };
    try {
      const out = await stateManager(call.request.service, statuses);
      if (out && ('status' in out)) result = out;
    } catch (err) {
      result.status = statuses.NOT_SERVING;
    }
    return callback(null, result);
  }

  return {
    protocol,
    interface,
    implementation: { Check },
    statuses,
  };
}

module.exports = {
  newHealthService,
  defaultOptions,
};
