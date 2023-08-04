const mainConfig = require('../../../main-config')
const { Command } = require('../../../lib')

class UsersBaseCommand extends Command {
  static get unitName() {
    return mainConfig.units.users.name
  }

  static get method() {
    return this.methods.GET
  }

  static get baseRoute() {
    return 'users'
  }
}

module.exports = { UsersBaseCommand }
