const { errorCodes, AppError } = require('./app-error');

class Command {
  static get methods() {
    return {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      PATCH: 'PATCH',
      DELETE: 'DELETE'
    }
  }

  static result (result) {
    return {
      success: result.success || true,
      status: result.status || 200,
      ...(result.cookies && { cookies: result.cookies }),
      ...(result.headers && { headers: result.headers }),
      ...(result.message && { message: result.message }),
      ...(result.data && { data: result.data })
    }
  }

  static validate({ ctx, body, params, query }) {
    if (this.validationRules.query) this.validateSchema(query, this.validationRules.query, 'query', ctx)
    if (this.validationRules.params) this.validateSchema(params, this.validationRules.params, 'params', ctx)
    if (this.validationRules.body) this.validateSchema(body, this.validationRules.body, 'body', ctx)
  }

  static validateSchema (src, requestSchema, schemaTitle, ctx) {
    this.validateExtraKeys(src, requestSchema, schemaTitle)

    const schemaKeys = Object.keys(requestSchema)
    if (!schemaKeys.length) return

    for (const propName in requestSchema) {
      const validationSrc = src[propName]
      const { schemaRule, options } = requestSchema[propName]
      const { validator, description, example } = schemaRule
      const dontHaveAllowedDefaultValues = !options.allowed.includes(validationSrc)

      if (options.required && !src.hasOwnProperty(propName) && dontHaveAllowedDefaultValues) {
        throw new AppError(errorCodes.VALIDATION, {
          message: `'${schemaTitle}.${propName}' field is required.`,
          layer: this.name,
          req: src
        })
      }


      if (src.hasOwnProperty(propName)) {
        const validationResult = validator(validationSrc)
        const validationResIsObject = (typeof validationResult === 'object') && !Array.isArray(validationResult)

        if (validationResIsObject && dontHaveAllowedDefaultValues) {
          throw new AppError(errorCodes.VALIDATION, {
            message: validationResult.message,
            meta: { example, ...validationResult, message: undefined },
            layer: this.name,
            req: src
          })
        }

        if (validationResult === false) {
          throw new AppError(errorCodes.VALIDATION, {
            message: `Invalid '${schemaTitle}.${propName}' field`,
            meta: { example, expect: description },
            layer: this.name,
            req: src
          })
        }
      }
    }
  }

  static validateExtraKeys(src, requestSchema, schemaTitle) {
    const defaultValidKeys = ['offset', 'page', 'limit', 'filter', 'orderBy', 'include', 'fields']
    const schemaKeys = Object.keys(requestSchema)
    const srcKeys = Object.keys(src)

    const invalidExtraKeys = srcKeys.filter(srcKey => !schemaKeys.includes(srcKey) && !defaultValidKeys.includes(srcKey))
    if (invalidExtraKeys.length) {
      throw new AppError(errorCodes.VALIDATION, {
        message: `Extra keys found in '${schemaTitle}' payload: [${invalidExtraKeys}]`,
        layer: this.constructor.name
      })
    }
  }

  static preparePayload(ctx) {
    const params = {}
    const body = {}
    for (const key in ctx.params) {
      key.startsWith('__')
        ? params[key.substring(2)] = ctx.params[key]
        : body[key] = ctx.params[key]
    }
    return { params, body }
  }
}

module.exports = { Command }
