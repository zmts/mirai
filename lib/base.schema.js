const Validator = require('fastest-validator')
const fastestValidator = new Validator({ haltOnFirstError: true })
const defaultSchema = { optional: true, nullable: false, empty: false }

class BaseSchema {
  static check ({ v, field, context, cache } = {}) {
    let result = null
    if (cache[field]) {
      result = cache[field]({ [field]: v })
    } else {
      const fieldSchema = context?.schema[field]?.fieldSchema
      cache[field] = fastestValidator.compile({ [field]: { ...fieldSchema, ...defaultSchema } })
      result = cache[field]({ [field]: v })
    }
    return typeof result === 'boolean' ? result : result[0]
  }
}

module.exports = { BaseSchema }
