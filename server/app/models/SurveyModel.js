var Survey = require('./BaseTable')
const { SQLifyDate } = require('../utils/sql')

Survey = new Survey()

var fields = [
    { name: 'name', type: 'VARCHAR', length: 150, default: '' },
    { name: 'slug', type: 'VARCHAR', length: 255, default: '' },
    { name: 'description', type: 'TEXT', length: 255, default: '' },
    { name: 'uses_codes', type: 'INT', length: 11, default: 0 },
    { name: 'start_date', type: 'TIMESTAMP', default: SQLifyDate(new Date()) },
    { name: 'end_date', type: 'TIMESTAMP', default: SQLifyDate(new Date()) }
]

User.table = 'surveys'
User.fields = User.fields.concat(fields)

module.exports = User