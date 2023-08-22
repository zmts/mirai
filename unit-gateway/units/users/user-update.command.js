const { UsersBaseCommand } = require('./users.base-command')
const { RequestRule } = require('../../../lib');
const { UserSchema } = require('./user.schema');

class UserUpdateCommand extends UsersBaseCommand {
  static get method() {
    return this.methods.PATCH
  }

  static get route() {
    return `${this.baseRoute}/:__id`
  }

  static get validationRules () {
    return {
      body: {
        name: new RequestRule(UserSchema.schema.name, { allowed: [null, ''] })
      }
    }
  }

  static async run(ctx) {
    const { params, body } = this.preparePayload(ctx)
    this.validate({ ctx, params, body })

    const data = await this.broker.call(`${this.unitName}.${this.name}`, { body, params })
    return this.result({ data })
  }
}

module.exports = { UserUpdateCommand }
