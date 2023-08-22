const { UsersListCommand, UserCreateCommand, UserUpdateCommand } = require('./commands.enum')
const { UsersService } = require('./services/users.service');

module.exports = {
  [UsersListCommand]: (ctx) => {
    return UsersService.getUsers(ctx)
  },
  [UserCreateCommand]: (ctx) => {
    return UsersService.createUser(ctx)
  },
  [UserUpdateCommand]: (ctx) => {
    return UsersService.updateUser(ctx)
  }
}
