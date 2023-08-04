const mainConfig = require('./main-config');

module.exports = {
  [mainConfig.units.gateway.name]: require('./unit-gateway/main'),
  [mainConfig.units.users.name]: require('./unit-users/main')
}
