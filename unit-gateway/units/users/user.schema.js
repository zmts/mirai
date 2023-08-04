const { BaseSchema, Rule } = require('../../../lib');

const cache = {}

class UserSchema extends BaseSchema {
  static get schema () {
    return {
      name: new Rule({
        validator: v => {
          return this.check({
            v, fieldName: 'name', fieldSchema: this.schema.name.fieldSchema, cache
          })
        },
        fieldSchema: { type: 'string', min: 5 },
      }),
      email: new Rule({
        validator: v => {
          return this.check({
            v, fieldName: 'email', fieldSchema: this.schema.email.fieldSchema, cache
          })
        },
        fieldSchema: { type: 'email', min: 15 },
      })
    }
  }
}

module.exports = { UserSchema }
