const Validator = require('fastest-validator')
const fastestValidator = new Validator({ haltOnFirstError: true })
const defaultSchema = { optional: true, nullable: false, empty: false }

class BaseSchema {
  static check ({ v, fieldName, fieldSchema, cache } = {}) {
    let result = null
    if (cache[fieldName]) {
      result = cache[fieldName]({ [fieldName]: v })
    } else {
      cache[fieldName] = fastestValidator.compile({ [fieldName]: { ...fieldSchema, ...defaultSchema } })
      result = cache[fieldName]({ [fieldName]: v })
    }
    return typeof result === 'boolean' ? result : result[0]
  }
}

module.exports = { BaseSchema }
