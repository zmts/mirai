const { Unit } = require('../lib');
const mainConfig  = require('../main-config')
const usersActions  = require('./modules/users/actions')

new Unit({
  brokerOptions: mainConfig.defaultBrokerOptions,
  serviceName: mainConfig.units.users.name,
  actions: { ...usersActions }
}).init();
