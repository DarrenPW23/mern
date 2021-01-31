var User = require('./BaseTable')

User = new User()

var fields = [
    { name: 'email', type: 'VARCHAR', length: 255, default: '' },
    { name: 'username', type: 'VARCHAR', length: 255, default: '' },
    { name: 'password', type: 'VARCHAR', length: 255, default: '' },
    { name: 'role', type: 'INT', length: 11, default: 'user' }
]

User.table = 'users'
User.fields = User.fields.concat(fields)

module.exports = User