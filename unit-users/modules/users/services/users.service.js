const { UsersRepo } = require('../users.repo');

class UsersService {
  static getUsers (ctx) {
    return UsersRepo.usersList()
  }

  static createUser (ctx) {
    return { id: 1 }
  }

  static updateUser (ctx) {
    return {
      id: Number(ctx.params.params.id),
      name: ctx.params.body.name
    }
  }
}

module.exports = { UsersService }
