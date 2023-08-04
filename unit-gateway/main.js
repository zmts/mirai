const mainConfig = require('../main-config');
const { UnitGateway } = require('../lib');
const gatewayActions = require('./units/gateway');
const usersActions = require('./units/users');

new UnitGateway({
  port: 6000,
  brokerOptions: mainConfig.defaultBrokerOptions,
  serviceName: mainConfig.units.gateway.name,
  actions: [
    ...Object.values(gatewayActions),
    ...Object.values(usersActions)
  ]
}).init();
