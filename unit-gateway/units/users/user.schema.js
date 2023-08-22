const { BaseSchema, Rule } = require('../../../lib');

const cache = {}

class UserSchema extends BaseSchema {
  static get schema () {
    return {
      name: new Rule({
        validator: v => this.check({ v, field: 'name', context: this, cache }),
        fieldSchema: { type: 'string', min: 5 },
      }),
      email: new Rule({
        validator: v => this.check({ v, field: 'email', context: this, cache }),
        fieldSchema: { type: 'email', min: 15 },
      })
    }
  }
}

module.exports = { UserSchema }
