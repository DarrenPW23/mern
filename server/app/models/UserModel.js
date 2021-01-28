var User = require('./BaseTable')

User = new User()

var fields = [
    { name: 'email', type: 'VARCHAR', length: 255, default: '' },
    { name: 'username', type: 'VARCHAR', length: 255, default: '' },
    { name: 'password', type: 'VARCHAR', length: 255, default: '' },
    { name: 'role', type: 'INT', length: 11, default: 'user' }
]

var fk = [
    { field: 'role', table: 'roles', belongsTo: 'ID' }
]

User.table = 'users'
User.fk = User.fk.concat(fk)
User.fields = User.fields.concat(fields)

module.exports = User