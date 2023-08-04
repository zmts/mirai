const { UsersBaseCommand } = require('./users.base-command')
const { RequestRule } = require('../../../lib');
const { UserSchema } = require('./user.schema');

class UserCreateCommand extends UsersBaseCommand {
  static get method() {
    return this.methods.POST
  }

  static get route() {
    return this.baseRoute
  }

  static get validationRules () {
    return {
      body: {
        name: new RequestRule(UserSchema.schema.name, { allowed: [null, ''] }),
        email: new RequestRule(UserSchema.schema.email),
      }
    }
  }

  static async run(ctx) {
    const { params, body } = this.preparePayload(ctx)
    this.validate({ ctx, params, body })

    const data = await this.broker.call(`${this.unitName}.${this.name}`, params)
    return this.result({ data })
  }
}

module.exports = { UserCreateCommand }
