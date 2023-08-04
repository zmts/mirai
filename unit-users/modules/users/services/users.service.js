const { UsersRepo } = require('../users.repo');

class UsersService {
  static getUsers (ctx) {
    return UsersRepo.usersList()
  }

  static createUser (ctx) {
    return { id: 1 }
  }
}

module.exports = { UsersService }
