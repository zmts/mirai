const {
  UsersListCommand,
  UserCreateCommand,
  UserUpdateCommand
} = require('../../../unit-gateway/units/users')

module.exports = {
  UsersListCommand: UsersListCommand.name,
  UserCreateCommand: UserCreateCommand.name,
  UserUpdateCommand: UserUpdateCommand.name,
}
