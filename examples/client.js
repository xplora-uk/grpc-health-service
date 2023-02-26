const { makeRequest } = require('cool-grpc');

const { host } = require('./_shared');

const protos = [
  '../echo.proto',
  '../lib/health.proto',
];

main();

async function main() {

  async function callEcho(data = 'hello') {
    return makeRequest(protos, {
      host,
      service: 'grpc.echo.v1.EchoService',
      method: 'Echo',
      data: { data },
    });
  }

  async function callHealthCheck(service = 'EchoService') {
    return makeRequest(protos, {
      host,
      service: 'grpc.health.v1.Health',
      method: 'Check',
      data: { service },
    });
  }

  console.log('calling EchoService.Echo()...');
  const dt = new Date();
  const echoReply = await callEcho('hello ' + dt.toISOString());
  console.log('calling echo... done!', echoReply);

  console.log('calling Health.Check()...');
  const healthCheckReply = await callHealthCheck();
  console.log('calling Health.Check()... done!', healthCheckReply);
}
