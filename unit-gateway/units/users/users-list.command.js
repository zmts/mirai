const { UsersBaseCommand } = require('./users.base-command')

class UsersListCommand extends UsersBaseCommand {
  static get method() {
    return this.methods.GET
  }

  static get route() {
    return this.baseRoute
  }

  static async run(ctx) {
    const data = await this.broker.call(`${this.unitName}.${this.name}`)
    return this.result({ data })
  }
}

module.exports = { UsersListCommand }
