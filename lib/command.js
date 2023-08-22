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

  static validateSchema (payload, requestSchema, schemaTitle, ctx) {
    this.validateExtraKeys(payload, requestSchema, schemaTitle)

    const schemaKeys = Object.keys(requestSchema)
    if (!schemaKeys.length) return

    for (const propName in requestSchema) {
      const payloadValue = payload[propName]
      const { schemaRule, options } = requestSchema[propName]
      const { validator, description, example } = schemaRule
      const dontHaveAllowedDefaultValues = !options.allowed.includes(payloadValue)

      if (options.required && !payload.hasOwnProperty(propName) && dontHaveAllowedDefaultValues) {
        throw new AppError(errorCodes.VALIDATION, {
          message: `'${schemaTitle}.${propName}' field is required.`,
          layer: this.name
        })
      }


      if (payload.hasOwnProperty(propName)) {
        const validationResult = validator(payloadValue)
        const isResultObj = (typeof validationResult === 'object') && !Array.isArray(validationResult)

        if (isResultObj && dontHaveAllowedDefaultValues) {
          throw new AppError(errorCodes.VALIDATION, {
            message: validationResult.message,
            meta: { example, ...validationResult, message: undefined },
            layer: this.name,
            req: this.getReqLog(ctx)
          })
        }

        if (validationResult === false) {
          throw new AppError(errorCodes.VALIDATION, {
            message: `Invalid '${schemaTitle}.${propName}' field`,
            meta: { example, expect: description },
            layer: this.name,
            req: this.getReqLog(ctx)
          })
        }
      }
    }
  }

  static validateExtraKeys(payload, requestSchema, schemaTitle) {
    const defaultValidKeys = ['offset', 'page', 'limit', 'filter', 'orderBy', 'include', 'fields']
    const schemaKeys = Object.keys(requestSchema)
    const payloadKeys = Object.keys(payload)

    const invalidExtraKeys = payloadKeys
      .filter(key => !schemaKeys.includes(key) && !defaultValidKeys.includes(key))

    if (invalidExtraKeys.length) {
      throw new AppError(errorCodes.VALIDATION, {
        message: `Extra keys found in '${schemaTitle}' payload: [${invalidExtraKeys}]`,
        layer: this.name
      })
    }
  }

  static preparePayload(ctx) {
    const params = {}
    const body = {}
    const query = ctx.params?.q || {}

    for (const key in ctx.params) {
      key.startsWith('__')
        ? params[key.substring(2)] = ctx.params[key]
        : body[key] = ctx.params[key]
    }
    return { params, body, query }
  }

  static getReqLog(ctx) {
    return {
      ...this.preparePayload(ctx),
      url: ctx.meta.url,
      method: ctx.meta.method,
      headers: parseRawHeaders(ctx.meta.rawHeaders)
    }
  }
}

module.exports = { Command }

const parseRawHeaders = (headers = []) => headers.reduce((acc, curr, idx) => {
  if (!headers?.length) return {}
  if (idx % 2 === 0) acc[headers[idx]] = headers[idx + 1]
  return acc
}, {})
