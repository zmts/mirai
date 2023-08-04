const { Unit } = require('../lib');
const mainConfig  = require('../main-config')

new Unit({
  brokerOptions: mainConfig.defaultBrokerOptions,
  serviceName: mainConfig.units.blogs.name,
});
