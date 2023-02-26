const { expect } = require('chai');
const lib = require('../lib');
const echo = require('./echo');

describe('newHealthService', () => {

  it('should run as expected with default inputs', async() => {
    let error = null;
    try {
      const echoServer = echo.newEchoServer();
      const healthService = lib.newHealthService();
      echoServer.addService(healthService.interface, healthService.implementation);
    } catch (err) {
      error = err;
    }
    expect(error).to.eq(null);
  });

  it('should run as expected with custom inputs', async () => {
    let error = null;
    try {
      const echoServer = echo.newEchoServer();
      const healthOptions = { longs: Number };
      const healthStateManager = async (_service, statuses) => ({ status: statuses.SERVING });
      const healthService = lib.newHealthService(healthOptions, healthStateManager);
      echoServer.addService(healthService.interface, healthService.implementation);
    } catch (err) {
      error = err;
    }
    expect(error).to.eq(null);
  });

});
