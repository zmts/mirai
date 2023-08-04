const { GatewayBaseCommand } = require('./gateway-base.command')

class HelloTestCommand extends GatewayBaseCommand {
  static get method() {
    return this.methods.GET
  }

  static get route() {
    return 'test'
  }

  static run() {
    return this.result({ message: 'hello unit-gateway!!!!!!!!' })
  }
}

module.exports = { HelloTestCommand }
