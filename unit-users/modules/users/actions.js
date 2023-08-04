const { UsersListCommand, UserCreateCommand } = require('./commands.enum')
const { UsersService } = require('./services/users.service');

module.exports = {
  [UsersListCommand]: (ctx) => {
    return UsersService.getUsers(ctx)
  },
  [UserCreateCommand]: (ctx) => {
    return UsersService.createUser(ctx)
  }
}
