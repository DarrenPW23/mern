const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env
const path = require('path')

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: path.resolve(__dirname, './db.sqlite')
        }
    },
    staging: {
        client: 'mysql',
        connection: {
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        }
    }
};