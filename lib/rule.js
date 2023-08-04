class Rule {
  constructor (src = {}) {
    if (!src.validator || typeof src.validator !== 'function') {
      throw new Error('Invalid validator type')
    }
    if (src.description && typeof src.description !== 'string') {
      throw new Error('Invalid rule description')
    }
    if (!src.fieldSchema) {
      throw new Error('Invalid rule fieldSchema')
    }

    this.validator = src.validator
    this.fieldSchema = src.fieldSchema || undefined
    this.description = src.description
    this.example = src.example || undefined
  }
}

module.exports = { Rule }
