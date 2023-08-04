const { AppError, errorCodes } = require('../../../lib');

class UsersRepo {
  static usersList () {
    // return [
    //   { id: 1, name: 'alex' },
    //   { id: 2, name: 'mary' },
    //   { id: 3, name: 'john' }
    // ]

    throw new AppError(errorCodes.NOT_FOUND)
  }
}

module.exports = { UsersRepo }
