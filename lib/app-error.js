const { MoleculerError } = require('moleculer').Errors

/**
 * @param code: string
 * @param options: object
 */
class AppError extends MoleculerError {
  constructor (code = '', options = {}) {
    const isValidCodeStr = typeof code === 'string' && code.length
    if (!isValidCodeStr) {
      throw new Error('AppError invalid "code" argument')
    }

    const { message = '', meta, req, layer, origin } = options
    const status = errorMap[code]?.status || 500
    const codeString = isValidCodeStr ? `${code}_ERROR` : `${errorCodes.SERVER}_ERROR`
    const description = errorMap[code]?.description || errorMap[errorCodes.SERVER].description
    const metaData = {
      description,
      layer : layer || undefined, // optional, application layer
      meta: meta || undefined, // optional, meta data
      req: req || undefined, // optional, some request data
      origin: origin || undefined // optional, should contain origin error
    }

    super(message || description, status, codeString, metaData)
  }
}

const errorCodes = {
  SERVER: 'SERVER',
  DEV_IMPLEMENTATION: 'DEV_IMPLEMENTATION',
  NO_ARGUMENT: 'NO_ARGUMENT',
  ARGUMENT_TYPE: 'ARGUMENT_TYPE',
  BAD_REQUEST: 'BAD_REQUEST',
  EMPTY_BODY: 'EMPTY_BODY',
  VALIDATION: 'VALIDATION',
  ACCESS: 'ACCESS',
  NO_ANONYMOUS_ACCESS: 'NO_ANONYMOUS_ACCESS',
  BAD_ROLE: 'BAD_ROLE',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_SESSION: 'INVALID_SESSION',
  TOKEN_NOT_SIGNED: 'TOKEN_NOT_SIGNED',
  TOKEN_VERIFY: 'TOKEN_VERIFY',
  BAD_REFRESH_TOKEN: 'BAD_REFRESH_TOKEN',
  WRONG_RESET_PASSWORD_TOKEN: 'WRONG_RESET_PASSWORD_TOKEN',
  WRONG_EMAIL_CONFIRM_TOKEN: 'WRONG_EMAIL_CONFIRM_TOKEN',
  PARSE_TOKEN: 'PARSE_TOKEN',
  EMAIL_ALREADY_TAKEN: 'EMAIL_ALREADY_TAKEN',
  SEND_EMAIL: 'SEND_EMAIL',
  DECRYPTION: 'DECRYPTION',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  NOT_FOUND: 'NOT_FOUND',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  DB_DUPLICATE_CONFLICT: 'DB_DUPLICATE_CONFLICT',
  DB_NOTNULL_CONFLICT: 'DB_NOTNULL_CONFLICT',
  DB: 'DB'
}

const errorMap = {
  [errorCodes.SERVER]: { description: 'Server error occurred' },
  [errorCodes.DEV_IMPLEMENTATION]: { description: 'Development implementation error' },
  [errorCodes.NO_ARGUMENT]: { description: 'Required arguments not supplied' },
  [errorCodes.ARGUMENT_TYPE]: { description: 'Wrong argument type' },
  [errorCodes.BAD_REQUEST]: { status: 400, description: 'Bad request' },
  [errorCodes.EMPTY_BODY]: { status: 400, description: 'Empty body is not allowed. Please fill the body' },
  [errorCodes.VALIDATION]: { status: 400, description: 'Invalid request' },
  [errorCodes.ACCESS]: { status: 403, description: 'Access denied' },
  [errorCodes.NO_ANONYMOUS_ACCESS]: { status: 403, description: 'Access denied. No anonymous access' },
  [errorCodes.BAD_ROLE]: { status: 403, description: 'Bad role' },
  [errorCodes.INVALID_CREDENTIALS]: { status: 403, description: 'Invalid credentials' },
  [errorCodes.INVALID_PASSWORD]: { status: 403, description: 'Invalid password' },
  [errorCodes.TOKEN_EXPIRED]: { status: 419, description: 'Token expired' },
  [errorCodes.SESSION_EXPIRED]: { description: 'Session(refresh token) expired', status: 419, code: 'SESSION_EXPIRED_ERROR' },
  [errorCodes.INVALID_SESSION]: { status: 401, description: 'Invalid session. Wrong fingerprint' },
  [errorCodes.TOKEN_NOT_SIGNED]: { description: 'Token not signed' },
  [errorCodes.TOKEN_VERIFY]: { status: 401, description: 'Token verify error' },
  [errorCodes.BAD_REFRESH_TOKEN]: { status: 401, description: 'Bad Refresh token' },
  [errorCodes.WRONG_RESET_PASSWORD_TOKEN]: { status: 401, description: 'Reset password token is not registered. Probably it already used' },
  [errorCodes.WRONG_EMAIL_CONFIRM_TOKEN]: { status: 401, description: 'Confirm email token is not registered. Probably it already used' },
  [errorCodes.PARSE_TOKEN]: {status: 401,  description: 'Trying get data from access token. Something wrong' },
  [errorCodes.EMAIL_ALREADY_TAKEN]: { status: 409, description: 'This email already taken, try use another' },
  [errorCodes.SEND_EMAIL]: { description: 'Send email error' },
  [errorCodes.DECRYPTION]: { description: 'Decryption error' },
  [errorCodes.ROUTE_NOT_FOUND]: { status: 404, description: 'Route not found' },
  [errorCodes.NOT_FOUND]: { status: 404, description: 'Empty response, not found' },
  [errorCodes.UNPROCESSABLE_ENTITY]: { status: 422, description: 'Unprocessable entity' },
  [errorCodes.DB_DUPLICATE_CONFLICT]: { status: 409, description: 'Duplicate conflict. Resource already exists' },
  [errorCodes.DB_NOTNULL_CONFLICT]: { description: 'Not null conflict' },
  [errorCodes.DB]: { description: 'Database error occurred' }
}

module.exports = { AppError, errorCodes }
